import {
  angle,
  checkIntersection,
  distance,
  rayIntersectsSegment,
} from "./utility/utility";

const HaxballJS = require("haxball.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
const {
  stringified2v2Stadium,
  getGoalForStadiumAndTeam,
} = require("./stadiums/stadiums");

const GAME_TICK_DIVIDER = 5;

const SHOT_SPEED_MULTIPLIER = 21;
const SHOT_DISTANCE_MULTIPLIER = 0.1;

const KICKED_SPEED_THRESHOLD = 110;
const EPSILON = 0.1;
const GOALIE_TO_BALL_DISTANCE = 36;

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

  const getBallSpeed = () => {
    if (!ballPositionForSpeed) {
      return 0;
    }
    const currentBallPosition = room.getBallPosition();
    return (
      distance(
        currentBallPosition.x,
        currentBallPosition.y,
        ballPositionForSpeed.x,
        ballPositionForSpeed.y,
      ) * SHOT_SPEED_MULTIPLIER
    );
  };

  function getPlayerClosestToBall() {
    const currentBallPosition = room.getBallPosition();
    let closestPlayer: PlayerObject = room.getPlayerList()[0];

    let closestDistance = distance(
      closestPlayer.position.x,
      closestPlayer.position.y,
      currentBallPosition.x,
      currentBallPosition.y,
    );
    room.getPlayerList().forEach((player: PlayerObject) => {
      if (
        distance(
          player.position.x,
          player.position.y,
          currentBallPosition.x,
          currentBallPosition.y,
        ) < closestDistance
      ) {
        closestPlayer = player;
        closestDistance = distance(
          player.position.x,
          player.position.y,
          currentBallPosition.x,
          currentBallPosition.y,
        );
      }
    });
    return closestPlayer;
  }

  const resetAvatars = () => {
    room.getPlayerList().forEach((player: PlayerObject) => {
      room.setPlayerAvatar(player.id, null);
    });
  };

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
  let isBallKicked = false;
  let kickedAngle = undefined;
  let kickedPosition = undefined;

  room.onGameTick = async () => {
    tick += 1;

    const currentBallPosition = room.getBallPosition();

    if (getBallSpeed() > KICKED_SPEED_THRESHOLD && !isBallKicked) {
      isBallKicked = true;
      // room.sendAnnouncement(`ball is kicked!`);

      kickedAngle = angle(
        ballPositionForSpeed.x,
        ballPositionForSpeed.y,
        currentBallPosition.x,
        currentBallPosition.y,
      );
      kickedPosition = currentBallPosition;
    }

    if (isBallKicked) {
      let currentTrajectoryAngle = angle(
        ballPositionForSpeed.x,
        ballPositionForSpeed.y,
        currentBallPosition.x,
        currentBallPosition.y,
      );
      if (Math.abs(kickedAngle - currentTrajectoryAngle) > EPSILON) {
        // room.sendAnnouncement(`ball changed trajectory`);

        const closestPlayer = getPlayerClosestToBall();
        const closestPlayerBallDistance = distance(
          closestPlayer.position.x,
          closestPlayer.position.y,
          currentBallPosition.x,
          currentBallPosition.y,
        );

        if (closestPlayerBallDistance < GOALIE_TO_BALL_DISTANCE) {
          // room.sendAnnouncement(`closes player is ${closestPlayer.name}`);

          isBallKicked = false;
          //now we need to check whether the ball was going towards the goal. we got the kicked position and we got the kicked angle.
          const playersOwnGoal = getGoalForStadiumAndTeam(
            currentMapName,
            closestPlayer.team === 1 ? "red" : "blue",
          );
          const goalFirstBar = {
            x: playersOwnGoal.p0[0],
            y: playersOwnGoal.p0[1],
          };
          const goalSecondBar = {
            x: playersOwnGoal.p1[0],
            y: playersOwnGoal.p1[1],
          };
          const goalCenter = {
            x: (goalFirstBar.x + goalSecondBar.x) / 2,
            y: (goalFirstBar.y + goalSecondBar.y) / 2,
          };
          const oppositeGoalCenter = {
            x: goalCenter.x * -1,
            y: goalCenter.y,
          };
          const distanceBetweenGoals = distance(
            goalCenter.x,
            goalCenter.y,
            oppositeGoalCenter.x,
            oppositeGoalCenter.y,
          );
          const distanceToGoal = distance(
            closestPlayer.position.x,
            closestPlayer.position.y,
            goalCenter.x,
            goalCenter.y,
          );
          console.log("kicked pos", kickedPosition);
          console.log("kicked angle", kickedAngle);
          console.log("goal", playersOwnGoal);
          console.log(
            rayIntersectsSegment(
              kickedPosition,
              kickedAngle,
              goalFirstBar,
              goalSecondBar,
            ),
          );
          if (
            distanceToGoal < distanceBetweenGoals / 3 &&
            rayIntersectsSegment(
              kickedPosition,
              kickedAngle,
              goalFirstBar,
              goalSecondBar,
            ).point
          ) {
            // room.sendAnnouncement(`Odbrana by: ${closestPlayer.name}`);
            const { data, error } = await supabase
              .from("saves")
              .insert({
                game_id: currentGameId,
                time: room.getScores().time,
                player_id: closestPlayer.name,
              })
              .select();

            console.log("saves", data, "saves error", error);
            lastEmojiChangePlayerId = closestPlayer.id;
            room.setPlayerAvatar(closestPlayer.id, "🙌");
            setTimeout(() => {
              resetAvatars();
            }, 1000);
          }
        } else {
          isBallKicked = false;
        }
      }
    }

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
  let lastEmojiChangePlayerId = undefined;
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
    isBallKicked = false;
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

    room.setPlayerAvatar(lastKickedPlayer.id, "⚽");

    // const playerAnnouncement = `Goal by: ${lastKickedPlayer.name}`;
    const ballSpeedAnnouncement = `Ball speed: ${ballPositionDifference.toFixed(0)} km/h; distance: ${lastKickedPlayerDifference.toFixed(0)} meters`;
    // room.sendAnnouncement(
    //   playerAnnouncement,
    //   undefined,
    //   team === 1 ? 0xec3838 : 0x2a9ff8,
    // );
    // room.sendAnnouncement(ballSpeedAnnouncement, undefined, 0xffffff);

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

      goal_speed: ballPositionDifference,
      goal_distance: lastKickedPlayerDifference,
    });

    beforeLastKickedPlayer = undefined;
    lastKickedPlayer = undefined;
    console.log("goal data", data, "goal error", error);
  };

  let currentMapName = "WFL | MEDIUM";

  room.onStadiumChange = (newStadiumName: string) => {
    console.log("set new map:", newStadiumName);
    currentMapName = newStadiumName;
  };

  room.onPositionsReset = () => {
    lastEmojiChangePlayerId = undefined;
    resetAvatars();
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
      `View replays and stats at: https://haxstats.expo.app/`,
    );
  };
});
