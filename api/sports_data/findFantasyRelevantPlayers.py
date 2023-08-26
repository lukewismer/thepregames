import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from nba_api.stats.static import players
from nba_api.stats.static import teams
from nba_api.stats.endpoints import commonplayerinfo, teaminfocommon, playerprofilev2


cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def nhl_players():
    players = db.collection(u'nhl_players')
    docs = players.stream()

    for doc in docs:
        r = requests.get("https://statsapi.web.nhl.com/api/v1/people/" + str(doc.id) + "/stats?stats=statsSingleSeason&season=20222023")
        data = r.json()
        if "stats" in data and "splits" in data["stats"][0] and len(data["stats"][0]["splits"]) > 0:
            if "wins" in data["stats"][0]["splits"][0]["stat"]:
                # Goalies
                if "games" in data["stats"][0]["splits"][0]["stat"]:
                    games = data["stats"][0]["splits"][0]["stat"]["games"]
                    if games > 20:
                        fantasy_relevant = True
                    else:
                        fantasy_relevant = False
            else:
                # Players
                if "games" in data["stats"][0]["splits"][0]["stat"]:
                    games = data["stats"][0]["splits"][0]["stat"]["games"]
                    if games > 40:
                        fantasy_relevant = True
                    else:
                        fantasy_relevant = False
        
        doc_ref = db.collection(u'nhl_players').document(str(doc.id))
        doc_ref.update({
            u'fantasy_relevant': fantasy_relevant,
            u'starter': fantasy_relevant
        })

def nfl_players():
    players = db.collection(u'nfl_players')
    docs = players.stream()

    season = "2023"
    teams = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30","33", "34"]
    relevantPlayers = []
    for teamId in teams:
        r = requests.get(f"https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/{season}/teams/{teamId}/depthcharts")
        data = r.json()
        if "items" in data and len(data["items"]) != 0:
            print("here")
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
                            wr = positions["wr"]
                            for wrs in wr["athletes"]:
                                if wrs["rank"] == 1:
                                    relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                                if wrs["rank"] == 2:
                                    relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                                if wrs["rank"] == 3:
                                    relevantPlayers.append(getNFLPlayerId(wrs["athlete"]["$ref"]))
                            te = positions["te"]
                            relevantPlayers.append(getNFLPlayerId(te["athletes"][0]["athlete"]["$ref"]))
                            qb = positions["qb"]
                            relevantPlayers.append(getNFLPlayerId(qb["athletes"][0]["athlete"]["$ref"]))
                            rb = positions["rb"]
                            relevantPlayers.append(getNFLPlayerId(rb["athletes"][0]["athlete"]["$ref"]))
                            relevantPlayers.append(getNFLPlayerId(rb["athletes"][1]["athlete"]["$ref"]))
                            lt = positions["lt"]
                            relevantPlayers.append(getNFLPlayerId(lt["athletes"][0]["athlete"]["$ref"]))
                            lg = positions["lg"]
                            relevantPlayers.append(getNFLPlayerId(lg["athletes"][0]["athlete"]["$ref"]))
                            c = positions["c"]
                            relevantPlayers.append(getNFLPlayerId(c["athletes"][0]["athlete"]["$ref"]))
                            rg = positions["rg"]
                            relevantPlayers.append(getNFLPlayerId(rg["athletes"][0]["athlete"]["$ref"]))
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
            print(str(doc.id) in relevantPlayers)
            doc_ref = db.collection(u'nfl_players').document(str(doc.id))
            doc_data = doc.to_dict() # Convert the document to a dictionary
            position = doc_data["position"] # Access the position field

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
            

        # If no more documents, break the loop
        if last_doc is None:
            break

        # Use the last document as the start for the next batch
        query = players.order_by(u'__name__').limit(30).start_after(last_doc)





if __name__ == "__main__":
    #nhl_players()
    nfl_players()
    #nba_players()