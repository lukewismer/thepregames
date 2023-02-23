import React, { useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

import './PowerHourForm.css';

const songs = [ 
    { "name": "Break Your Heart", "url": "https://www.youtube.com/watch?v=ddgcdagdbwI"},
    { "name": "Bad Romance", "url": "https://www.youtube.com/watch?v=TTOPBQhrvtQ"},
    { "name": "California Girls", "url": "https://www.youtube.com/watch?v=F57P9C4SAW4"},
    { "name": "Lets Get It Started", "url": "https://www.youtube.com/watch?v=Q3AWa9s7cic"},
    { "name": "Hey Baby", "url": "https://www.youtube.com/watch?v=LefQdEMJP1I"},
    { "name": "Party In The U.S.A", "url": "https://www.youtube.com/watch?v=4xCuAxheUNU"},
    { "name": "I Gotta Feeling", "url": "https://www.youtube.com/watch?v=CwdrtwZiQ9E"},
    { "name": "Party Rock Anthem", "url": "https://www.youtube.com/watch?v=zIh5AHxh-Ok"},
    { "name": "Like A G6", "url": "https://www.youtube.com/watch?v=GvgJEznqtms"},
    { "name": "Where Them Girls At", "url": "https://www.youtube.com/watch?v=CcT3NTZYmiI"},
    { "name": "Hey Ya!", "url": "https://www.youtube.com/watch?v=-7XnDlYY9qw"},
    { "name": "Just Dance", "url": "https://www.youtube.com/watch?v=5q7byFPTehs"},
    { "name": "Pursuit Of Happiness", "url": "https://www.youtube.com/watch?v=Dq_uy1qcO-k"},
    { "name": "Best Song Ever", "url": "https://www.youtube.com/watch?v=-zCF1-emakY"},
    { "name": "Waiting For Love", "url": "https://www.youtube.com/watch?v=cHHLHGNpCSA"},
    { "name": "Empire State of Mind", "url": "https://www.youtube.com/watch?v=MKkbQr1Eq58"},
    { "name": "Memories", "url": "https://www.youtube.com/watch?v=NUVCQXMUVnI"},
    { "name": "Call Me Maybe", "url": "https://www.youtube.com/watch?v=fWNaR-rxAic"},
    { "name": "Shake It Off", "url": "https://www.youtube.com/watch?v=8xG7mH8i-WE"},
    { "name": "Trap Queen", "url": "https://www.youtube.com/watch?v=1AM_VSfudig"},
    { "name": "S&M", "url": "https://www.youtube.com/watch?v=Ce2_k0LaE7E"},
    { "name": "Fireball", "url": "https://www.youtube.com/watch?v=If27FnxvjZA"},
    { "name": "Perfect", "url": "https://www.youtube.com/watch?v=Ho32Oh6b4jc"},
    { "name": "Raise Your Glass", "url": "https://www.youtube.com/watch?v=XjVNlG5cZyQ"},
    { "name": "Drag Me Down", "url": "https://www.youtube.com/watch?v=Jwgf3wmiA04"},
    { "name": "Time Of Our Lives", "url": "https://www.youtube.com/watch?v=PuoyrrZfC9o"}, //Clean
    { "name": "Don't Stop The Music", "url": "https://www.youtube.com/watch?v=0PeIgSY0RA4"},
    { "name": "The Nights", "url": "https://www.youtube.com/watch?v=2S0QhGGO1gQ"},
    { "name": "Poker Face", "url": "https://www.youtube.com/watch?v=bESGLojNYSo"},
    { "name": "Give Me Everything", "url": "https://www.youtube.com/watch?v=EPo5wWmKEaI"},
    { "name": "Knock Kock", "url": "https://www.youtube.com/watch?v=oQIm6jq7Wfg"},
    { "name": "One More Time", "url": "https://www.youtube.com/watch?v=A2VpR8HahKc"},
    { "name": "Old Thing Back", "url": "https://youtu.be/NKk3FwIswPM?t=51"},
    { "name": "What Makes You Beautiful", "url": "https://www.youtube.com/watch?v=QJO3ROT-A4E"},
    { "name": "Whistle", "url": "https://www.youtube.com/watch?v=cSnkWzZ7ZAA"},
    { "name": "California Love", "url": "https://www.youtube.com/watch?v=J7_bMdYfSws"},
    { "name": "Tongue Tied", "url": "https://www.youtube.com/watch?v=Fot9VQGVxAk"},
    { "name": "Heads Will Roll", "url": "https://www.youtube.com/watch?v=auzfTPp4moA"},
    { "name": "Heaven", "url": "https://www.youtube.com/watch?v=EY72Qqj7G6M"},
    { "name": "Timber", "url": "https://www.youtube.com/watch?v=hHUbLv4ThOo"},
    { "name": "Club Can't Handle Me", "url": "https://www.youtube.com/watch?v=bBcOuOyVD5Y"},
    { "name": "Dynamite", "url": "https://www.youtube.com/watch?v=kJNyjdpT1vo"},
    { "name": "Low", "url": "https://www.youtube.com/watch?v=U2waT9TxPU0"},
    { "name": "We Found Love", "url": "https://www.youtube.com/watch?v=GchEVSx9XEA"},
    { "name": "Cheap Thrills", "url": "https://www.youtube.com/watch?v=J1b22l1kFKY"},
    { "name": "Levitating", "url": "https://www.youtube.com/watch?v=jeiPmdVm-zA"},
    { "name": "UCLA", "url": "https://www.youtube.com/watch?v=p2EM5o8stKo"},
    { "name": "The Spins", "url": "https://www.youtube.com/watch?v=LhaEXzVwNS4"},
    { "name": "Never Say Never", "url": "https://www.youtube.com/watch?v=_Z5-P9v3F8w"},
    { "name": "Mr. Brightside", "url": "https://www.youtube.com/watch?v=UFKf08us2AI"},
    { "name": "Steal My Girl", "url": "https://www.youtube.com/watch?v=sahsquWlw5I"},
    { "name": "Baby", "url": "https://www.youtube.com/watch?v=kffacxfA7G4"},
    { "name": "Since U Been Gone", "url": "https://www.youtube.com/watch?v=R7UrFYvl5TE"},
    { "name": "The Sweet Escape", "url": "https://www.youtube.com/watch?v=J2mUmv5q-hI"},
    { "name": "Sexy Bitch", "url": "https://youtu.be/UecZcIxLgBo?t=3"},
    { "name": "Smack That", "url": "https://youtu.be/bKDdT_nyP54?t=37"},
    { "name": "Dangerous", "url": "https://www.youtube.com/watch?v=Ro7yHf_pU14"},
    { "name": "Still D.R.E", "url": "https://www.youtube.com/watch?v=KDK5j-pd8tQ"},
    { "name": "Firework", "url": "https://www.youtube.com/watch?v=KSbwHzlcgs8"},
    { "name": "Last Friday Night (TGIF)", "url": "https://www.youtube.com/watch?v=lCMJA9jyEMg"},
    { "name": "Donald Trump", "url": "https://www.youtube.com/watch?v=aiz1qwGaD8I"},
    { "name": "Head & Heart", "url": "https://www.youtube.com/watch?v=qparhhC1YB0"},
    { "name": "Fireproof", "url": "https://www.youtube.com/watch?v=CUpYtKl7fM4"},
    { "name": "Turning Me Up", "url": "https://www.youtube.com/watch?v=F-kGvRJcBVA"},
    { "name": "Ride", "url": "https://www.youtube.com/watch?v=jHKQof8WIlI"},
    { "name": "Crazy In Love", "url": "https://www.youtube.com/watch?v=5bnxJnYiMwk"},
    { "name": "Prominiscuous", "url": "https://www.youtube.com/watch?v=eBo7BqQCFPI"},
    { "name": "Hotel Room Service", "url": "https://www.youtube.com/watch?v=DxIL6dio2CI"},
    { "name": "Dark Horse", "url": "https://www.youtube.com/watch?v=xtoHuHgS9_o"},
    { "name": "Super Bass", "url": "https://www.youtube.com/watch?v=4JipHEz53sU"},
    { "name": "Shut Up and Dance", "url": "https://youtu.be/6JCLY0Rlx6Q?t=17"},
    { "name": "All Night Longer", "url": "https://www.youtube.com/watch?v=kOmvUVDeO0I"},
    { "name": "Sunshine", "url": "https://www.youtube.com/watch?v=Jbch_x5132o"},
    { "name": "Tonight", "url": "https://www.youtube.com/watch?v=UecPqm2Dbes"},
    { "name": "Hangover", "url": "https://www.youtube.com/watch?v=hToYLtkLwlw"},
    { "name": "Die Young", "url": "https://www.youtube.com/watch?v=NOubzHCUt48"},
    { "name": "We R Who We R", "url": "https://www.youtube.com/watch?v=tCkGsyOYDMI"},
    { "name": "White Walls", "url": "https://www.youtube.com/watch?v=B0ET14JfjGI"},
    { "name": "Play Hard", "url": "https://www.youtube.com/watch?v=ZxM5XKVvKAE"},
    { "name": "Savage Love", "url": "https://www.youtube.com/watch?v=gUci-tsiU4I"},
    { "name": "Watcha Say", "url": "https://www.youtube.com/watch?v=pBI3lc18k8Q"},
    { "name": "Moves Like Jagger", "url": "https://youtu.be/iEPTlhBmwRg?t=60"},
    { "name": "Run This Town", "url": "https://www.youtube.com/watch?v=8tbuWaCo58U"},
    { "name": "International Love", "url": "https://www.youtube.com/watch?v=WB9XOekBcjU"},
    { "name": "Gimme! Gimme! Gimme!", "url": "https://www.youtube.com/watch?v=JWay7CDEyAI"},
    { "name": "Love We Lost", "url": "https://www.youtube.com/watch?v=IbWMGLimSCc"},
    { "name": "No Pressure", "url": "https://www.youtube.com/watch?v=GATWVvn9VBs"},
    { "name": "The Middle", "url": "https://www.youtube.com/watch?v=4QWzYjatCCs"},
    { "name": "Call on Me", "url": "https://www.youtube.com/watch?v=qetW6R9Jxs4"},
    { "name": "Calabria 2008", "url": "https://www.youtube.com/watch?v=v2Gu922HqcA"},
    { "name": "Umbrella", "url": "https://www.youtube.com/watch?v=CvBfHwUxHIk"},
    { "name": "Stronger", "url": "https://www.youtube.com/watch?v=3mwiO5st-us"},
    { "name": "Beggin'", "url": "https://youtu.be/zrFI2gJSuwA?t=20"},
    { "name": "Good Girls Go Bad", "url": "https://www.youtube.com/watch?v=ofOhryWUQPQ"},
    { "name": "See You Again", "url": "https://www.youtube.com/watch?v=t-hi0yCeOJ0"},
    { "name": "Get Busy", "url": "https://www.youtube.com/watch?v=HXceurkQcCs"},
    { "name": "Paper Planes", "url": "https://www.youtube.com/watch?v=ewRjZoRtu0Y"},
    { "name": "That's Not My Name", "url": "https://www.youtube.com/watch?v=v1c2OfAzDTI"},
    { "name": "Pon de Replay", "url": "https://youtu.be/oEauWw9ZGrA?t=10"},
    { "name": "Hot n Cold", "url": "https://www.youtube.com/watch?v=LG558yBrNfk"},
    { "name": "SOS", "url": "https://www.youtube.com/watch?v=IXmF4GbA86E"},
    { "name": "I Love It", "url": "https://www.youtube.com/watch?v=W50HtcPAeSs"},
    { "name": "More Than You Know", "url": "https://www.youtube.com/watch?v=ycq5eYpvwds"},
    { "name": "Without You", "url": "https://www.youtube.com/watch?v=ERi9UR07rQw"},
    { "name": "High Hopes", "url": "https://www.youtube.com/watch?v=fH_OnJk6QqU"},
    { "name": "Tonight Tonight", "url": "https://youtu.be/QzlNFcT2aOE?t=9"},
    { "name": "Ridin' Solo", "url": "https://www.youtube.com/watch?v=pnkb3UFwm_w"},
    { "name": "Yeah!", "url": "https://www.youtube.com/watch?v=b0Ow9PBxZCA"},
    { "name": "Payphone", "url": "https://youtu.be/KRaWnd3LJfs?t=39"},
    { "name": "Classic", "url": "https://www.youtube.com/watch?v=4Ba_qTPA4Ds"},
    { "name": "Good Time", "url": "https://www.youtube.com/watch?v=H7HmzwI67ec"},
    { "name": "Beautiful Girls", "url": "https://youtu.be/MrTz5xjmso4?t=18"},
    { "name": "We Can't Stop", "url": "https://www.youtube.com/watch?v=Km3wOjaRyE4"},
    { "name": "Live Your Life", "url": "https://www.youtube.com/watch?v=13RlgMa91tU"},
    { "name": "One More Night", "url": "https://www.youtube.com/watch?v=7CPYoGtI75Q"},
    { "name": "Cooler Than Me", "url": "https://www.youtube.com/watch?v=l-TaaIQ2_1A"},
    { "name": "Want U Back", "url": "https://www.youtube.com/watch?v=-We7wfOskCo"},
    { "name": "Magic", "url": "https://www.youtube.com/watch?v=Cq-NShfefks"},
    { "name": "Everybody Talks", "url": "https://www.youtube.com/watch?v=swoVAisnOLo"},
    { "name": "Give Your Heart a Break", "url": "https://www.youtube.com/watch?v=1zfzka5VwRc"},
    { "name": "What's My Name?", "url": "https://www.youtube.com/watch?v=3RYhAN8kQoM"},
    { "name": "Lights", "url": "https://www.youtube.com/watch?v=0NKUpo_xKyQ"},
    { "name": "Ayy Ladies", "url": "https://www.youtube.com/watch?v=BOVc7wNGkzM"},
    { "name": "Black and Yellow", "url": "https://www.youtube.com/watch?v=7SHAKi8l7Ls"},
    { "name": "No Money", "url": "https://www.youtube.com/watch?v=xUVz4nRmxn4"},
    { "name": "Don't Tell 'Em", "url": "https://www.youtube.com/watch?v=MqyCoAgiGnI"},
    { "name": "Can't Hold Us", "url": "https://www.youtube.com/watch?v=VG3JsmOmDqw"},
    { "name": "I Cry", "url": "https://www.youtube.com/watch?v=LxwkF13vLdU"},
    { "name": "Feel This Moment", "url": "https://www.youtube.com/watch?v=5jlI4uzZGjU"},
    { "name": "Burn", "url": "https://www.youtube.com/watch?v=CGyEd0aKWZE"},
    { "name": "On The Floor", "url": "https://www.youtube.com/watch?v=t4H_Zoh7G5A"},
    { "name": "Wild Ones", "url": "https://www.youtube.com/watch?v=OQZM-nA6DZk"},
    { "name": "Just Can't Get Enough", "url": "https://www.youtube.com/watch?v=MUCo7vM-FCk"},
    { "name": "Omg", "url": "https://youtu.be/1RnPB76mjxI?t=5"},
    { "name": "I Knew You Were Trouble", "url": "https://www.youtube.com/watch?v=TqAollrUJdA"},
    { "name": "Starships", "url": "https://www.youtube.com/watch?v=ib5vOL3Ka2s"},
    { "name": "Only Girl", "url": "https://www.youtube.com/watch?v=-ySWIyJj3I0"},
    { "name": "Forever", "url": "https://www.youtube.com/watch?v=5sMKX22BHeE"},
    { "name": "We Takin' Over", "url": "https://www.youtube.com/watch?v=E-vq8XUX8b4"},
    { "name": "Price Tag", "url": "https://youtu.be/qMxX-QOV9tI?t=16"},
    { "name": "Whatever You Like", "url": "https://www.youtube.com/watch?v=wDQR0-3fFWs"},
    { "name": "The Middle", "url": "https://www.youtube.com/watch?v=xQzS3JnZQZM"},
    { "name": "Ni**as in Paris", "url": "https://www.youtube.com/watch?v=fbFnF-86eYs"},
    { "name": "SexyBack", "url": "https://www.youtube.com/watch?v=gfWQ1r6IQrY"},
    { "name": "The Way I Are", "url": "https://www.youtube.com/watch?v=O6pEJXtUFQ8"},
    { "name": "Fancy", "url": "https://www.youtube.com/watch?v=O-zpOMYRi0w"},
    { "name": "Kids", "url": "https://www.youtube.com/watch?v=aBd46BbdTfs"},
    { "name": "Electric Feel", "url": "https://www.youtube.com/watch?v=VI2XVLoPMJs"},
    { "name": "Evacuate the Dancefloor", "url": "https://www.youtube.com/watch?v=A68j28KQaik"},
    { "name": "The Less I Know the Better", "url": "https://www.youtube.com/watch?v=O2lzmpEs29M"},
    { "name": "Dancing Queen", "url": "https://www.youtube.com/watch?v=3qiMJt-JBb4"},
    { "name": "Hello", "url": "https://youtu.be/jNm_wrWquPs?t=26"},
  ];

function PowerHourForm() {
  const [name, setName] = useState('');
  const [playlist, setPlaylist] = useState("prom"); 
  const [songInterval, setSongInterval] = useState(60000); 
  const [tornadoInterval, setTornadoInterval] = useState(180000); 
  const [namesList, setNamesList] = useState([]);
  const navigate = useNavigate();


  const handleAddName = () => {
    setNamesList([...namesList, name]);
    setName('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let playlistSongs = null;
    if (playlist === "prom") {
        playlistSongs = songs;
    }
    navigate("/powerhour", {songInterval, playlistSongs, tornadoInterval, namesList})
  }

  return (
    <>
        <Navbar />
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Power Hour Set Up</h2>
            <label htmlFor="name">Name:</label>
            <input type="text" value={name} onChange={handleNameChange} />
            <button type="button" onClick={handleAddName}>Add Name</button>
            <ul>
                {namesList.map((name, index) => (
                <li key={index}>{name}</li>
                ))}
            </ul>

            <label htmlFor="songInterval">Song Interval:</label>
            <div className="radio-container">
                <div>
                <input type="radio" id="30" name="songInterval" value="30" checked={songInterval===30000} onChange={(e) => setSongInterval(30000)} />
                <label htmlFor="30">30 Seconds</label>
                </div>
                <div>
                <input type="radio" id="40" name="songInterval" value="40" checked={songInterval===40000} onChange={(e) => setSongInterval(40000)} />
                <label htmlFor="40">40 Seconds</label>
                </div>
                <div>
                <input type="radio" id="50" name="songInterval" value="50" checked={songInterval===50000} onChange={(e) => setSongInterval(50000)} />
                <label htmlFor="50">50 Seconds</label>
                </div>
                <div>
                <input type="radio" id="60" name="songInterval" value="60" checked={songInterval===60000} onChange={(e) => setSongInterval(60000)} />
                <label htmlFor="60">60 Seconds</label>
                </div>
            </div>

            <label htmlFor="tornadoInterval">Tornado Interval:</label>
            <div className="radio-container">
                <div>
                <input type="radio" id="2m" name="tornadoInterval" value="2m" checked={tornadoInterval===120000} onChange={(e) => setTornadoInterval(120000)} />
                <label htmlFor="2m">2 Minutes</label>
                </div>
                <div>
                <input type="radio" id="3m" name="tornadoInterval" value="3m" checked={tornadoInterval===180000} onChange={(e) => setTornadoInterval(180000)} />
                <label htmlFor="3m">3 Minutes</label>
                </div>
                <div>
                <input type="radio" id="4m" name="tornadoInterval" value="4m" checked={tornadoInterval===240000} onChange={(e) => setTornadoInterval(240000)} />
                <label htmlFor="4m">4 Minutes</label>
                </div>
                <div>
                <input type="radio" id="5m" name="tornadoInterval" value="5m" checked={tornadoInterval===300000} onChange={(e) => setTornadoInterval(300000)} />
                <label htmlFor="5m">5 Minutes</label>
                </div>
                <div>
                <input type="radio" id="n/a" name="tornadoInterval" value="n/a" checked={tornadoInterval===100000*100000*100000} onChange={(e) => setTornadoInterval(100000*100000*100000)} />
                <label htmlFor="n/a">None</label>
                </div>
            </div>

            <label htmlFor="playlist">Playlist:</label>
            <div className="radio-container">
                <div>
                <input type="radio" id="prom" name="playlist" value="prom" checked={playlist==="prom"} onChange={(e) => setPlaylist(e.target.value)} />
                <label htmlFor="prom">Prom</label>
                </div>
                <div>
                <input type="radio" id="n/a" name="playlist" value="n/a" checked={playlist==="n/a"} onChange={(e) => setPlaylist(e.target.value)} />
                <label htmlFor="n/a">N/A</label>
                </div>
            </div>

            <button type="submit">Submit</button>
        </form>
    </>
  );
}

export default PowerHourForm;
