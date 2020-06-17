
function openlb() {
   $("#openLeaderBoard").remove();
   $("#leaderdiv").append('<img src="./images/btn_back.png" class="leaderboard" id="openLeaderBoard" onclick="hidelb()"/>');
   $("#canvas").hide();
   $("#openSideBar").hide();
   $("#highScoreInGameText").hide();
   $("#startBtn").hide();
   $("#showleader").show();
}

function hidelb() {
   $("#openLeaderBoard").remove();
   $("#leaderdiv").append('<img src="./images/leaderboard.png" class="leaderboard" id="openLeaderBoard" onclick="openlb()"/>');
   $("#canvas").show();
   $("#openSideBar").show();
   $("#highScoreInGameText").show();
   $("#startBtn").show();
   $("#showleader").hide();
}
