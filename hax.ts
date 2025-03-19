const HaxballJS = require('haxball.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// const BAGERI_STADIUM = () => {
//     return `{name:"BAGERI MEDIUM",width:430,height:200,bg:{type:"",color:"454C5E",width:0,height:0},vertexes:[{x:0,y:200,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{x:0,y:80,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2"},{x:0,y:-80,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2"},{x:0,y:-200,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{x:-368,y:-65,bCoef:.1,cMask:["ball"],bias:2,color:"c4c9d4"},{x:-400,y:-65,bCoef:.1,cMask:["ball"],bias:0},{x:-400,y:65,bCoef:.1,cMask:["ball"],bias:0},{x:-368,y:65,bCoef:.1,cMask:["ball"],bias:2,color:"c4c9d4"},{x:368,y:-65,bCoef:.1,cMask:["ball"],bias:-2,color:"c4c9d4"},{x:400,y:-65,bCoef:.1,cMask:["ball"],bias:0},{x:400,y:65,bCoef:.1,cMask:["ball"],bias:0},{x:368,y:65,bCoef:.1,cMask:["ball"],bias:-2,color:"c4c9d4"},{x:-368,y:65,bCoef:1.1,cMask:["ball"],color:"c4c9d4",bias:32},{x:-368,y:171.5,bCoef:1.1,cMask:["ball"],color:"a3acc2",bias:32},{x:-368,y:-65,bCoef:1.1,cMask:["ball"],color:"c4c9d4",bias:-32},{x:-368,y:-171.5,bCoef:1.1,cMask:["ball"],color:"a3acc2",bias:-32},{x:-368,y:170,bCoef:1.3,cMask:["ball"],color:"a3acc2"},{x:368,y:170,bCoef:1.3,cMask:["ball"],color:"a3acc2"},{x:368,y:65,bCoef:1.1,cMask:["ball"],color:"c4c9d4",bias:-32},{x:368,y:171.5,bCoef:1.1,cMask:["ball"],color:"a3acc2",bias:-32},{x:368,y:-171.5,bCoef:1.1,cMask:["ball"],color:"a3acc2",bias:-32},{x:368,y:-65,bCoef:1.1,cMask:["ball"],color:"c4c9d4",bias:-32},{x:-368,y:-170,cMask:["ball"],color:"a3acc2"},{x:368,y:-170,cMask:["ball"],color:"a3acc2"},{x:0,y:-170,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2"},{x:0,y:-80,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2",curve:0},{x:0,y:80,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2"},{x:0,y:170,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"],color:"a3acc2"},{x:-366.5,y:122,bCoef:.1,cMask:[],color:"a3acc2"},{x:-366.5,y:-122,bCoef:.1,cMask:[],color:"a3acc2"},{x:366.5,y:122,bCoef:.1,cMask:[],color:"a3acc2"},{x:366.5,y:-122,bCoef:.1,cMask:[],color:"a3acc2"},{x:-368,y:65,bCoef:.1,cMask:[],color:"c4c9d4",curve:0},{x:-368,y:-65,bCoef:.1,cMask:[],color:"c4c9d4",curve:0},{x:368,y:65,bCoef:.1,cMask:[],color:"c4c9d4",curve:0},{x:368,y:-65,bCoef:.1,cMask:[],color:"c4c9d4",curve:0},{x:-60,y:-14.166666666666675,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-60,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-60,y:-14.166666666666675,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-50,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-40,y:-14.166666666666675,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-40,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-40,y:-14.166666666666675,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-50,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-28,y:-14.166666666666675,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-28,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-17.07964190174173,y:-13.58259504701502,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-17.07964190174173,y:.5840716196516537,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-2.0796419017417325,y:14.084071619641655,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-17.07964190174173,y:14.08407161965165,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-2.0796419017417325,y:.5840716196516537,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-2.0796419017417325,y:14.08407161965165,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:19.62391582568174,y:-11.874630856840849,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:34.123915825681735,y:-11.874630856840849,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-17.07964190174173,y:-13.882594380348346,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-2.0796419017417325,y:-13.882594380348346,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:25.62391582568174,y:13.792025809825827,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:34.123915825681735,y:13.792025809825827,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-18.07964190174173,y:1.4174049529849717,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:-2.0796419017417325,y:1.4174049529849788,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:35.623915825681735,y:-13.541297523507513,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:35.623915825681735,y:13.792035809825823,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:10,y:-13.83333333333334,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}},curve:0},{x:10,y:13.499999999999996,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}},curve:0},{x:47.96020230428835,y:-13.83333,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:62.96020230428835,y:-13.8333,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:47.96020230428835,y:0,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{x:62.96020230428835,y:0,cGroup:["c1"],trait:"none",color:"1a2125",_data:{mirror:{}}},{cGroup:["c1"],x:62.96020230428835,y:15.025852681529935,_data:{mirror:{}}},{cGroup:["c1"],x:47.96020230428835,y:14.70387012406858,_data:{mirror:{}}}],segments:[{v0:4,v1:5,color:"DB7F89",bCoef:.1,cMask:["ball"],bias:2,y:-65},{v0:5,v1:6,color:"DB7F89",bCoef:.1,cMask:["ball"],bias:0,x:-400},{v0:6,v1:7,color:"DB7F89",bCoef:.1,cMask:["ball"],bias:2,y:65},{v0:8,v1:9,color:"7FA8DB",bCoef:.1,cMask:["ball"],bias:-2,y:-65},{v0:9,v1:10,color:"7FA8DB",bCoef:.1,cMask:["ball"],bias:0},{v0:10,v1:11,color:"7FA8DB",bCoef:.1,cMask:["ball"],bias:-2,y:65},{v0:0,v1:1,vis:!1,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{v0:1,v1:2,curve:180,color:"a3acc2",bCoef:.1,cMask:["red","blue"],cGroup:["blueKO"]},{v0:2,v1:1,curve:180,color:"a3acc2",bCoef:.1,cMask:["red","blue"],cGroup:["redKO"]},{v0:2,v1:3,vis:!1,bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{v0:12,v1:13,color:"a3acc2",bCoef:1.1,cMask:["ball"],bias:32,x:-368},{v0:14,v1:15,color:"a3acc2",bCoef:1.1,cMask:["ball"],bias:-32,x:-368},{v0:16,v1:17,color:"a3acc2",cMask:["ball"],y:170},{v0:18,v1:19,color:"a3acc2",bCoef:1.1,cMask:["ball"],bias:-32,x:368},{v0:20,v1:21,color:"a3acc2",bCoef:1.1,cMask:["ball"],bias:-32,x:368},{v0:22,v1:23,color:"a3acc2",bCoef:2,cMask:["ball"],y:-170},{v0:24,v1:25,color:"a3acc2",bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{v0:26,v1:27,color:"a3acc2",bCoef:.1,cMask:["red","blue"],cGroup:["redKO","blueKO"]},{v0:29,v1:28,curve:180,color:"a3acc2",bCoef:.1,cMask:[]},{v0:30,v1:31,curve:180,color:"a3acc2",bCoef:.1,cMask:[]},{v0:33,v1:32,curve:0,color:"c4c9d4",bCoef:.1,cMask:[]},{v0:35,v1:34,curve:0,color:"c4c9d4",bCoef:.1,cMask:[],x:368},{v0:36,v1:37,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-60,-14.166666666666675],b:[-60,13.499999999999996],radius:null,center:[null,null],from:null,to:null}}},{v0:38,v1:39,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-60,-14.166666666666675],b:[-50,13.499999999999996],radius:null,center:[null,null],from:null,to:null}}},{v0:40,v1:41,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-40,-14.166666666666675],b:[-40,13.499999999999996],radius:null,center:[null,null],from:null,to:null}}},{v0:42,v1:43,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-40,-14.166666666666675],b:[-50,13.499999999999996],radius:null,center:[null,null],from:null,to:null}}},{v0:44,v1:45,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-28,-14.166666666666675],b:[-28,13.499999999999996],radius:null,center:[null,null],from:null,to:null}},x:-28},{v0:46,v1:47,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-17.07964190174173,-13.58259504701502],b:[-17.07964190174173,.5840716196516537],radius:null,center:[null,null],from:null,to:null}}},{v0:48,v1:49,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-2.0796419017417325,14.084071619641655],b:[-17.07964190174173,14.08407161965165],radius:null,center:[null,null],from:null,to:null}}},{v0:50,v1:51,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-2.0796419017417325,.5840716196516537],b:[-2.0796419017417325,14.08407161965165],radius:null,center:[null,null],from:null,to:null}},x:-5},{v0:52,v1:53,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[19.62391582568174,-11.874630856840849],b:[34.123915825681735,-11.874630856840849],radius:null,center:[null,null],from:null,to:null}}},{v0:54,v1:55,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",y:-14.466666,_data:{mirror:{},arc:{a:[-17.07964190174173,-13.882594380348346],b:[-2.0796419017417325,-13.882594380348346],radius:null,center:[null,null],from:null,to:null}}},{v0:56,v1:57,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[25.62391582568174,13.792025809825827],b:[34.123915825681735,13.792025809825827],radius:null,center:[null,null],from:null,to:null}}},{v0:58,v1:59,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[-18.07964190174173,1.4174049529849717],b:[-2.0796419017417325,1.4174049529849788],radius:null,center:[null,null],from:null,to:null}}},{v0:60,v1:61,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",x:20,_data:{mirror:{},arc:{a:[35.623915825681735,-13.541297523507513],b:[35.623915825681735,13.792035809825823],radius:null,center:[null,null],from:null,to:null}}},{v0:62,v1:63,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",x:10,_data:{mirror:{},arc:{a:[10,-13.83333333333334],b:[10,13.499999999999996],curve:0}},curve:0},{v0:64,v1:65,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[47.96020230428835,-13.83333],b:[62.96020230428835,-13.8333],radius:null,center:[null,null],from:null,to:null}}},{v0:66,v1:67,vis:!0,color:"1a2125",cGroup:["c1"],trait:"none",_data:{mirror:{},arc:{a:[47.96020230428835,0],b:[62.96020230428835,0],radius:null,center:[null,null],from:null,to:null}}},{vis:!0,color:"1a2125",cGroup:["c1"],v0:65,v1:68,_data:{mirror:{},arc:{a:[62.96020230428835,-13.8333],b:[62.96020230428835,15.025852681529935],radius:null,center:[null,null],from:null,to:null}}},{vis:!0,color:"1a2125",cGroup:["c1"],v0:64,v1:69,_data:{mirror:{},arc:{a:[47.96020230428835,-13.83333],b:[47.96020230428835,14.70387012406858],radius:null,center:[null,null],from:null,to:null}}}],planes:[{normal:[0,1],dist:-170,bCoef:1.1,cMask:["ball"],_data:{extremes:{normal:[0,1],dist:-170,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-6088.294449438983,-170],b:[6095.142924635203,-170]}}},{normal:[0,-1],dist:-170,bCoef:1.1,cMask:["ball"],_data:{extremes:{normal:[0,-1],dist:-170,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-6088.294449438983,170],b:[6095.142924635203,170]}}},{normal:[0,1],dist:-200,bCoef:.1,_data:{extremes:{normal:[0,1],dist:-200,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-6088.294449438983,-200],b:[6095.142924635203,-200]}}},{normal:[0,-1],dist:-200,bCoef:.1,_data:{extremes:{normal:[0,-1],dist:-200,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-6088.294449438983,200],b:[6095.142924635203,200]}}},{normal:[1,0],dist:-430,bCoef:.1,_data:{extremes:{normal:[1,0],dist:-430,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-430,-2581.875148974687],b:[-430,2581.875148974687]}}},{normal:[-1,0],dist:-430,bCoef:.1,_data:{extremes:{normal:[-1,0],dist:-430,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[430,-2581.875148974687],b:[430,2581.875148974687]}}},{normal:[1,0],dist:-400,bCoef:.1,cMask:["ball"],_data:{extremes:{normal:[1,0],dist:-400,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[-400,-2581.875148974687],b:[-400,2581.875148974687]}}},{normal:[-1,0],dist:-400,bCoef:.1,cMask:["ball"],_data:{extremes:{normal:[-1,0],dist:-400,canvas_rect:[-6088.294449438983,-2581.875148974687,6095.142924635203,2581.875148974687],a:[400,-2581.875148974687],b:[400,2581.875148974687]}}}],goals:[{p0:[-377,-65],p1:[-377,65],team:"red",color:"c4c9d4"},{p0:[377,65],p1:[377,-65],team:"blue",color:"c4c9d4"}],discs:[{radius:4.5,invMass:0,pos:[-368,65],color:"EF8275"},{radius:4.5,invMass:0,pos:[-368,-65],color:"EF8275"},{radius:4.5,invMass:0,pos:[368,65],color:"3c7fc6"},{radius:4.5,invMass:0,pos:[368,-65],color:"3c7fc6"}],playerPhysics:{bCoef:.15,acceleration:.11,kickingAcceleration:.083,kickStrength:4.6,radius:15,invMass:.5,damping:.96,cGroup:["red","blue"],gravity:[0,0],kickingDamping:.96,kickback:0},ballPhysics:{radius:6.5,bCoef:.425,invMass:1.5,color:"FFFFFF",cMask:["all"],damping:.99,gravity:[0,0],cGroup:["ball"]},spawnDistance:180,traits:{},joints:[],redSpawnPoints:[],blueSpawnPoints:[],canBeStored:!1,cameraWidth:0,cameraHeight:0,maxViewWidth:0,cameraFollow:"ball",kickOffReset:"partial"};`
// }


HaxballJS().then((HBInit) => {
    // If there are no admins left in the room give admin to one of the remaining players.
    function updateAdmins() {
        // Get all players
        var players = room.getPlayerList();
        if ( players.length == 0 ) return; // No players left, do nothing.

        //find fiaskoza! and give him an admin
        players.forEach(player => {
            if(player.name == "fiaskoza!"){
                room.setPlayerAdmin(player.id, true)
            }
        })

        if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
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
        await supabase
            .from("game_links")
            .insert({
                game_link: link,
            })
    };

    room.onPlayerJoin = async (player: PlayerObject) => {
        updateAdmins();
        await supabase.from("players").insert({id: player.name, name: player.name})
    }

    room.onPlayerLeave = function() {
        updateAdmins();
    }


    let currentGameId = undefined

    room.onGameStart = async () => {
        const { data, error } = await supabase
            .from('games')
            .insert({})
            .select()

        currentGameId = data[0].id;
    }

    let lastKickedPlayer = undefined
    room.onPlayerBallKick = (player: PlayerObject) =>{
        lastKickedPlayer = player
    }

    room.onTeamGoal = async (team: TeamID) => {
        await supabase.from("players").insert({id: lastKickedPlayer.name, name: lastKickedPlayer.name})
        await supabase
            .from('goals')
            .insert({
                game_id: currentGameId,
                player_id: lastKickedPlayer.name,
                is_own_goal: team !== lastKickedPlayer.team
            })
    }

    room.onTeamVictory = async (scores: ScoresObject) => {
        await supabase
            .from('games')
            .upsert({id: currentGameId, ended_at: new Date().toISOString(), winning_team_id: scores.red > scores.blue ? 0:1 })

        let game_player = []

        room.getPlayerList().forEach((player: PlayerObject) => {
            game_player.push({
                game_id: currentGameId,
                player_id: player.name,
                team_id: player.team
            })
        })

        const {error} = await supabase
            .from('game_player')
            .insert(game_player)

        console.log("game_player", error)
    }
});
