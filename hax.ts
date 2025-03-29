const HaxballJS = require("haxball.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const GAME_TICK_DIVIDER = 10;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
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
    // password: "Sarajevo123***",
    public: false,
    token: process.env.HAX_TOKEN, // Required
  });

  room.setDefaultStadium("Big");
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

  room.onGameTick = () => {
    tick += 1;
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
    [beforeLastKickedPlayer, lastKickedPlayer] = [
      lastKickedPlayer,
      beforeLastKickedPlayer,
    ];
    lastKickedPlayer = player;
  };

  room.onTeamGoal = async (team: TeamID) => {
    await supabase
      .from("players")
      .insert({ id: lastKickedPlayer.name, name: lastKickedPlayer.name });
    await supabase.from("game_player").upsert({
      game_id: currentGameId,
      player_id: lastKickedPlayer.name,
      team_id: lastKickedPlayer.team,
    });
    const { data, error } = await supabase.from("goals").insert({
      game_id: currentGameId,
      player_id: lastKickedPlayer.name,
      goal_for_team_id: team,
      is_own_goal: team !== lastKickedPlayer.team,
      time: room.getScores().time,

      assist_player_id:
        beforeLastKickedPlayer.team === team &&
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
    await supabase
      .from("games")
      .upsert({
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
  };
});
