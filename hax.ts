import { distance } from "./utility/utility";

const HaxballJS = require("haxball.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const { stringified2v2Stadium } = require("./stadiums/stadiums");

const GAME_TICK_DIVIDER = 5;

const SHOT_SPEED_MULTIPLIER = 21;
const SHOT_DISTANCE_MULTIPLIER = 0.1;

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.LEGACY_JWT_SECRET; // You can find this in your Supabase project settings under API. Store this securely.
const USER_ID = "6b08a887-5db1-465c-8f0a-d2518365a3e3"; // the user id that we want to give the manager role

const token = jwt.sign({ role: "hax_server" }, JWT_SECRET, {
  expiresIn: "1h",
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

HaxballJS().then((HBInit) => {
  // If there are no admins left in the room give admin to one of the remaining players.
  function updateAdmins() {
    // Get all players
    var players = room.getPlayerList();
    if (players.length == 0) return; // No players left, do nothing.

    //find fiaskoza! and give him an admin
    players.forEach((player) => {
      if (player.name == "fiaskoza!") {
        room.setPlayerAdmin(player.id, true);
      }
    });

    if (players.find((player) => player.admin) != null) return; // There's an admin left so do nothing.
    room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
  }

  // Same as in Haxball Headless Host Documentation
  const room = HBInit({
    roomName: "Misija",
    maxPlayers: 16,
    noPlayer: true, // Remove host player (recommended!)
    public: false,
    token: process.env.HAX_TOKEN, // Required
  });

  room.setCustomStadium(stringified2v2Stadium);
  room.setScoreLimit(3);
  room.setTimeLimit(3);

  room.onRoomLink = async (link) => {
    console.log(link);
    await supabase.from("game_links").insert({
      game_link: link,
    });
  };

  room.onPlayerJoin = async (player: PlayerObject) => {
    updateAdmins();
    await supabase
      .from("players")
      .insert({ id: player.name, name: player.name });
  };

  room.onPlayerLeave = function () {
    updateAdmins();
  };

  let tick = GAME_TICK_DIVIDER;
  let ballPositionForSpeed = undefined;

  room.onGameTick = () => {
    tick += 1;
    ballPositionForSpeed = room.getBallPosition();
    if (tick % GAME_TICK_DIVIDER === 0) {
      const ballPosition = room.getBallPosition();
      if (ballPosition.x !== 0 && ballPosition.y !== 0) {
        heatmap.push([
          ...room.getPlayerList(),
          {
            name: "ball",
            isBall: true,
            team: 0,
            position: {
              x: ballPosition.x,
              y: ballPosition.y,
            },
          },
        ]);
      }
    }
  };

  let currentGameId = undefined;
  let heatmap = [];

  room.onGameStart = async () => {
    tick = Math.round(GAME_TICK_DIVIDER / 2); //this is so the starting position is not logged
    heatmap = [];
    room.setTeamsLock(true);
    const { data, error } = await supabase.from("games").insert({}).select();

    currentGameId = data[0].id;
  };
  room.onGameStop = () => {
    room.setTeamsLock(false);
  };

  let beforeLastKickedPlayer = undefined;
  let lastKickedPlayer = undefined;
  room.onPlayerBallKick = (player: PlayerObject) => {
    //swap the values
    beforeLastKickedPlayer = lastKickedPlayer;
    lastKickedPlayer = player;
  };

  room.onTeamGoal = async (team: TeamID) => {
    if (!lastKickedPlayer?.name) {
      return;
    }

    const isOwnGoal = team !== lastKickedPlayer.team;

    const currentBallPosition = room.getBallPosition();
    const ballPositionDifference =
      distance(
        currentBallPosition.x,
        currentBallPosition.y,
        ballPositionForSpeed.x,
        ballPositionForSpeed.y,
      ) * SHOT_SPEED_MULTIPLIER;

    const lastKickedPlayerDifference =
      distance(
        lastKickedPlayer.position.x,
        lastKickedPlayer.position.y,
        currentBallPosition.x,
        currentBallPosition.y,
      ) * SHOT_DISTANCE_MULTIPLIER;

    const playerAnnouncement = `Goal by: ${lastKickedPlayer.name}`;
    const ballSpeedAnnouncement = `Ball speed: ${ballPositionDifference.toFixed(0)} km/h; distance: ${lastKickedPlayerDifference.toFixed(0)} meters`;
    room.sendAnnouncement(
      playerAnnouncement,
      undefined,
      team === 1 ? 0xec3838 : 0x2a9ff8,
    );
    room.sendAnnouncement(ballSpeedAnnouncement, undefined, 0xffffff);

    await supabase
      .from("players")
      .insert({ id: lastKickedPlayer?.name, name: lastKickedPlayer.name });
    await supabase.from("game_player").upsert({
      game_id: currentGameId,
      player_id: lastKickedPlayer.name,
      team_id: lastKickedPlayer.team,
    });
    const { data, error } = await supabase.from("goals").insert({
      game_id: currentGameId,
      player_id: lastKickedPlayer.name,
      goal_for_team_id: team,
      is_own_goal: isOwnGoal,
      time: room.getScores().time,

      assist_player_id:
        beforeLastKickedPlayer?.team === team &&
        lastKickedPlayer.team === team &&
        beforeLastKickedPlayer.name !== lastKickedPlayer.name
          ? beforeLastKickedPlayer.name
          : undefined,
    });

    beforeLastKickedPlayer = undefined;
    lastKickedPlayer = undefined;
    console.log("goal data", data, "goal error", error);
  };

  let currentMapName = "Big";

  room.onStadiumChange = (newStadiumName: string) => {
    console.log("set new map:", newStadiumName);
    currentMapName = newStadiumName;
  };

  room.onTeamVictory = async (scores: ScoresObject) => {
    await supabase.from("games").upsert({
      id: currentGameId,
      ended_at: new Date().toISOString(),
      winning_team_id: scores.red > scores.blue ? 1 : 2,
      time: scores.time,
    });

    let game_player = [];

    room.getPlayerList().forEach((player: PlayerObject) => {
      game_player.push({
        game_id: currentGameId,
        player_id: player.name,
        team_id: player.team,
      });
    });

    const { error } = await supabase.from("game_player").upsert(game_player);

    console.log("game_player", error);
    const { error: heatmapError } = await supabase.from("heatmaps").upsert({
      game_id: currentGameId,
      heatmap: heatmap,
      map_name: currentMapName,
    });

    console.log("heatmapError", heatmapError);

    room.sendAnnouncement(
      `https://haxstats.expo.app/viewReplay?id=${currentGameId}`,
    );
  };
});
