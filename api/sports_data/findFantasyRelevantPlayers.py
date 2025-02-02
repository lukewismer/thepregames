import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import statsapi

from nba_api.stats.static import players
from nba_api.stats.static import teams
from nba_api.stats.endpoints import commonplayerinfo, teaminfocommon, playerprofilev2
import datetime


cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def nhl_players():
    players_ref = db.collection(u'nhl_players')
    query = players_ref.order_by(u'__name__').limit(100)  # Batch size of 100

    while True:
        docs = query.stream()
        last_doc = None

        for doc in docs:
            try:
                # Existing processing code for each document
                r = requests.get(f"https://api-web.nhle.com/v1/player/{doc.id}/landing")
                data = r.json()
                fantasy_relevant = False
                starter = False

                season_stats = data.get("seasonTotals", [])
                for season in season_stats:
                    if season.get("gameTypeId") == 2 and season.get("season") == 20242025 and season.get("leagueAbbrev") == "NHL":
                        position = data.get("position", "")
                        if position == "G":
                            if season.get("savePctg", 0) > 0.90:
                                fantasy_relevant = True
                                starter = True
                        else:
                            points_per_game = season.get("points", 0) / season.get("gamesPlayed", 1)
                            if (position == "D" and points_per_game > 0.33) or (position != "D" and points_per_game > 0.5):
                                fantasy_relevant = True
                            toi = season.get("avgToi", "0:00")
                            minutes = int(toi.split(":")[0])
                            if minutes > 12:
                                starter = True

                # Update Firestore document
                doc_ref = players_ref.document(doc.id)
                doc_ref.update({
                    u'fantasy_relevant': fantasy_relevant,
                    u'starter': starter
                })
                last_doc = doc
            except Exception as e:
                print(f"Error processing NHL player {doc.id}: {e}")
                continue

        if not last_doc:
            break  

        query = players_ref.order_by(u'__name__').limit(100).start_after(last_doc)

def nfl_players():
    season = "2024"
    teams = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30","33", "34"]
    relevantPlayers = []
    for teamId in teams:
        r = requests.get(f"https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{season}/teams/{teamId}/depthcharts")
        data = r.json()
        if "items" in data and len(data["items"]) != 0:
            for formation in data["items"]:
                if formation["name"] != "Special Teams":
                    if "positions" in formation:
                        if "nt" in formation["positions"]:
                            # 3-4 Defense
                            positions = formation["positions"]
                            lde = positions["lde"]
                            relevantPlayers.append(getNFLPlayerId(lde["athletes"][0]["athlete"]["$ref"]))
                            nt = positions["nt"]
                            relevantPlayers.append(getNFLPlayerId(nt["athletes"][0]["athlete"]["$ref"]))
                            rde = positions["rde"]
                            relevantPlayers.append(getNFLPlayerId(rde["athletes"][0]["athlete"]["$ref"]))
                            wlb = positions["wlb"]
                            relevantPlayers.append(getNFLPlayerId(wlb["athletes"][0]["athlete"]["$ref"]))
                            lilb = positions["lilb"]
                            relevantPlayers.append(getNFLPlayerId(lilb["athletes"][0]["athlete"]["$ref"]))
                            rilb = positions["rilb"]
                            relevantPlayers.append(getNFLPlayerId(rilb["athletes"][0]["athlete"]["$ref"]))
                            slb = positions["slb"]
                            relevantPlayers.append(getNFLPlayerId(slb["athletes"][0]["athlete"]["$ref"]))
                            ss = positions["ss"]
                            relevantPlayers.append(getNFLPlayerId(ss["athletes"][0]["athlete"]["$ref"]))
                            fs = positions["fs"]
                            relevantPlayers.append(getNFLPlayerId(fs["athletes"][0]["athlete"]["$ref"]))
                            lcb = positions["lcb"]
                            relevantPlayers.append(getNFLPlayerId(lcb["athletes"][0]["athlete"]["$ref"]))
                            rcb = positions["rcb"]
                            relevantPlayers.append(getNFLPlayerId(rcb["athletes"][0]["athlete"]["$ref"]))
                        elif "ldt" in formation["positions"]:
                            # 4-3 Defense
                            positions = formation["positions"]
                            lde = positions["lde"]
                            relevantPlayers.append(getNFLPlayerId(lde["athletes"][0]["athlete"]["$ref"]))
                            ldt = positions["ldt"]
                            relevantPlayers.append(getNFLPlayerId(ldt["athletes"][0]["athlete"]["$ref"]))
                            rdt = positions["rdt"]
                            relevantPlayers.append(getNFLPlayerId(rdt["athletes"][0]["athlete"]["$ref"]))
                            rde = positions["rde"]
                            relevantPlayers.append(getNFLPlayerId(rde["athletes"][0]["athlete"]["$ref"]))
                            wlb = positions["wlb"]
                            relevantPlayers.append(getNFLPlayerId(wlb["athletes"][0]["athlete"]["$ref"]))
                            mlb = positions["mlb"]
                            relevantPlayers.append(getNFLPlayerId(mlb["athletes"][0]["athlete"]["$ref"]))
                            slb = positions["slb"]
                            relevantPlayers.append(getNFLPlayerId(slb["athletes"][0]["athlete"]["$ref"]))
                            ss = positions["ss"]
                            relevantPlayers.append(getNFLPlayerId(ss["athletes"][0]["athlete"]["$ref"]))
                            fs = positions["fs"]
                            relevantPlayers.append(getNFLPlayerId(fs["athletes"][0]["athlete"]["$ref"]))
                            lcb = positions["lcb"]
                            relevantPlayers.append(getNFLPlayerId(lcb["athletes"][0]["athlete"]["$ref"]))
                            rcb = positions["rcb"]
                            relevantPlayers.append(getNFLPlayerId(rcb["athletes"][0]["athlete"]["$ref"]))
                        else:
                            
                            # Offense 3WR 1TE
                            positions = formation["positions"]
                            if "wr" in positions:
                                wr = positions["wr"]
                                for wrs in wr["athletes"]:
                                    if wrs["rank"] == 1:
                                        relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                                    if wrs["rank"] == 2:
                                        relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                                    if wrs["rank"] == 3:
                                        relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                            if "te" in positions:
                                te = positions["te"]
                                relevantPlayers.append(getNFLPlayerId(te["athletes"][0]["athlete"]["$ref"]))
                            if "qb" in positions:
                                qb = positions["qb"]
                                relevantPlayers.append(getNFLPlayerId(qb["athletes"][0]["athlete"]["$ref"]))
                            if "rb" in positions:
                                rb = positions["rb"]
                                relevantPlayers.append(getNFLPlayerId(rb["athletes"][0]["athlete"]["$ref"]))
                                relevantPlayers.append(getNFLPlayerId(rb["athletes"][1]["athlete"]["$ref"]))
                            if "lt" in positions:
                                lt = positions["lt"]
                                relevantPlayers.append(getNFLPlayerId(lt["athletes"][0]["athlete"]["$ref"]))
                            if "lg" in positions:
                                lg = positions["lg"]
                                relevantPlayers.append(getNFLPlayerId(lg["athletes"][0]["athlete"]["$ref"]))
                            if "c" in positions:
                                c = positions["c"]
                                relevantPlayers.append(getNFLPlayerId(c["athletes"][0]["athlete"]["$ref"]))
                            if "rg" in positions:
                                rg = positions["rg"]
                                relevantPlayers.append(getNFLPlayerId(rg["athletes"][0]["athlete"]["$ref"]))
                            if "rt" in positions:
                                rt = positions["rt"]
                                relevantPlayers.append(getNFLPlayerId(rt["athletes"][0]["athlete"]["$ref"]))


    
    update_nfl_players_in_batches(relevantPlayers)

def getNFLPlayerId(playerLink):
    finalString = playerLink.split("/")[-1]
    return finalString.split("?")[0]

def update_nfl_players_in_batches(relevantPlayers):
    players = db.collection(u'nfl_players')
    query = players.order_by(u'__name__').limit(100)

    while True:
        docs = query.stream()
        last_doc = None
        for doc in docs:
            doc_ref = db.collection(u'nfl_players').document(str(doc.id))
            doc_data = doc.to_dict() 
            position = doc_data["position"]

            doc_ref.update({
                u'starter': str(doc.id) in relevantPlayers
            })
            last_doc = doc

            fantasy_positions = ["Quarterback", "Running Back", "Wide Receiver", "Tight End"]
            if position in fantasy_positions:
                doc_ref.update({
                u'fantasy_relevant': True
            })
            else:
                doc_ref.update({
                u'fantasy_relevant': False
            })

        if last_doc is None:
            break

        query = players.order_by(u'__name__').limit(100).start_after(last_doc)


def nba_players():
    players = db.collection(u'nba_players')
    query = players.order_by(u'__name__').limit(100)  # Order by document ID and fetch the first 100 documents

    while True:
        docs = query.stream()
        last_doc = None
        
        for doc in docs:
            print(doc.id)
            fantasy_relevant = False
            player_id = doc.id
            try:
                profile = playerprofilev2.PlayerProfileV2(player_id=player_id).get_data_frames()[0].to_dict()

                games_started = profile["GS"][len(profile["GS"]) - 1]
                mpg = profile["MIN"][len(profile["MIN"]) - 1] / profile["GP"][len(profile["GP"]) - 1]

                if mpg > 10:
                    fantasy_relevant = True
                else:
                    fantasy_relevant = False

                if games_started > 30:
                    starter = True
                else:
                    starter = False

                doc_ref = db.collection(u'nba_players').document(str(doc.id))
                doc_ref.update({
                    u'fantasy_relevant': fantasy_relevant,
                    u'starter': starter
                })
                last_doc = doc
            except:
                doc_ref = db.collection(u'nba_players').document(str(doc.id))
                doc_ref.update({
                    u'fantasy_relevant': False,
                    u'starter': False
                })
                last_doc = doc
                continue
            
        if last_doc is None:
            break

        query = players.order_by(u'__name__').limit(30).start_after(last_doc)

def mlb_players():
    players_ref = db.collection(u'mlb_players')

    # Process in batches to avoid Firestore timeouts
    query = players_ref.order_by(u'__name__').limit(100)  # Batch size of 100

    while True:
        docs = query.stream()
        last_doc = None

        for doc in docs:
            player_id = doc.id
            player_data = doc.to_dict()
            position = player_data.get('position', '')
            fantasy_relevant = False
            starter = False

            try:
                # Fetch season stats using the correct endpoint and parameters
                stats = statsapi.player_stat_data(
                    personId=player_id,
                    group="hitting" if position != "P" else "pitching",
                    type="season",
                    sportId=1,  # MLB
                )

                if stats and "stats" in stats:
                    stat_data = stats["stats"][0].get("stats", {})

                    if position != "P":
                        # Hitter criteria
                        plate_appearances = stat_data.get("plateAppearances", 0)
                        games_played = stat_data.get("gamesPlayed", 0)
                        fantasy_relevant = int(plate_appearances) >= 200 or int(games_played) >= 50
                        starter = int(games_played) >= 50
                    else:
                        # Pitcher criteria
                        games_started = stat_data.get("gamesStarted", 0)
                        innings_pitched = stat_data.get("inningsPitched", 0)
                        era = stat_data.get("era", 99.99)
                        saves = stat_data.get("saves", 0)

                        starter = int(games_started) >= 5
                        fantasy_relevant = (
                            (starter and float(innings_pitched) >= 50 and float(era) <= 4.50)
                            or (not starter and int(saves) >= 5)
                        )

                    # Update Firestore document
                    doc_ref = players_ref.document(player_id)
                    doc_ref.update({
                        u'fantasy_relevant': fantasy_relevant,
                        u'starter': starter
                    })
                else:
                    print(f"No stats found for player {player_id}")

                last_doc = doc
            except Exception as e:
                print(f"Error processing MLB player {player_id}: {str(e)}")
                continue

        if not last_doc:
            break  # Exit loop if no more documents

        # Query next batch starting after the last document
        query = players_ref.order_by(u'__name__').limit(100).start_after(last_doc)

if __name__ == "__main__":
    #nhl_players()
    #mlb_players()
    #nba_players()
    nfl_players()
    
    