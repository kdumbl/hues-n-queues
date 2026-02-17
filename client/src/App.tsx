import { useState } from "react";
import huesLogo from "./assets/logo.png";
import "./App.css";

//<img src={huesLogo} className="logo" alt="Hues and logo" />

function ScoreRows(){
  return(
    <>
      <div className="hcboard-row">
        <div className="hcscorediv" style={{background: '#000000'}}></div>
        <div className="hcscorediv" style={{background: '#414141'}}></div>
        <div className="hcscorediv" style={{background: '#424443'}}></div>
        <div className="hcscorediv" style={{background: '#464646'}}></div>
        <div className="hcscorediv" style={{background: '#474948'}}></div>
        <div className="hcscorediv" style={{background: '#4a4c4b'}}>5</div>
        <div className="hcscorediv" style={{background: '#4d4d4d'}}></div>
        <div className="hcscorediv" style={{background: '#4f4f4f'}}></div>
        <div className="hcscorediv" style={{background: '#525453'}}></div>
        <div className="hcscorediv" style={{background: '#545655'}}></div>
        <div className="hcscorediv" style={{background: '#575757'}}>10</div>
        <div className="hcscorediv" style={{background: '#595b5a'}}></div>
        <div className="hcscorediv" style={{background: '#5d5d5d'}}></div>
        <div className="hcscorediv" style={{background: '#5e605f'}}></div>
        <div className="hcscorediv" style={{background: '#606261'}}></div>
        <div className="hcscorediv" style={{background: '#636363'}}>15</div>
        <div className="hcscorediv" style={{background: '#676765'}}></div>
        <div className="hcscorediv" style={{background: '#696969'}}></div>
        <div className="hcscorediv" style={{background: '#6b6d6c'}}></div>
        <div className="hcscorediv" style={{background: '#6f6f6f'}}></div>
        <div className="hcscorediv" style={{background: '#707271'}}>20</div>
        <div className="hcscorediv" style={{background: '#737574'}}></div>
        <div className="hcscorediv" style={{background: '#767676'}}></div>
        <div className="hcscorediv" style={{background: '#797979'}}></div>
        <div className="hcscorediv" style={{background: '#7b7d7c'}}></div>
        <div className="hcscorediv" style={{background: '#7e807f'}}>25</div>
      </div>
      <div className="hcboard-row">
        <div className="hcscorediv" style={{background: '#000000'}}></div>
        <div className="hcscorediv" style={{background: '#bdbdbd', color: '#000'}}>50</div>
        <div className="hcscorediv" style={{background: '#bababa'}}></div>
        <div className="hcscorediv" style={{background: '#b9b9b9'}}></div>
        <div className="hcscorediv" style={{background: '#b5b5b5'}}></div>
        <div className="hcscorediv" style={{background: '#b3b3b3'}}></div>
        <div className="hcscorediv" style={{background: '#b0b2b1', color: '#000'}}>45</div>
        <div className="hcscorediv" style={{background: '#aeaeae'}}></div>
        <div className="hcscorediv" style={{background: '#acacac'}}></div>
        <div className="hcscorediv" style={{background: '#a8aaa9'}}></div>
        <div className="hcscorediv" style={{background: '#a6a6a4'}}></div>
        <div className="hcscorediv" style={{background: '#a3a3a3', color: '#000'}}>40</div>
        <div className="hcscorediv" style={{background: '#a1a19f'}}></div>
        <div className="hcscorediv" style={{background: '#9ea09f'}}></div>
        <div className="hcscorediv" style={{background: '#9c9c9c'}}></div>
        <div className="hcscorediv" style={{background: '#9a9a9a'}}></div>
        <div className="hcscorediv" style={{background: '#979795', color: '#000'}}>35</div>
        <div className="hcscorediv" style={{background: '#959595'}}></div>
        <div className="hcscorediv" style={{background: '#929290'}}></div>
        <div className="hcscorediv" style={{background: '#919191'}}></div>
        <div className="hcscorediv" style={{background: '#8e8e8e'}}></div>
        <div className="hcscorediv" style={{background: '#8c8c8c', color: '#000'}}>30</div>
        <div className="hcscorediv" style={{background: '#878988'}}></div>
        <div className="hcscorediv" style={{background: '#858786'}}></div>
        <div className="hcscorediv" style={{background: '#838584'}}></div>
        <div className="hcscorediv" style={{background: '#808281'}}></div>
      </div>
    </>
  )
}

function TopRow({ lh }){
  return (
    <>
      <div className="hcsquarediv" style={{background: '#000000'}}></div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>1</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>2</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>3</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>4</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>5</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>6</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>7</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>8</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>9</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>10</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>11</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>12</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>13</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>14</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>15</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>16</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>17</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>18</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>19</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>20</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>21</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>22</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>23</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>24</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>25</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>26</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>27</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>28</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>29</div>
      <div className="hcsquarediv" style={{background: '#000000', "line-height": lh}}>30</div>
      <div className="hcsquarediv" style={{background: '#000000'}}></div>
    </>
  )
}

function HCRow({row_colors, letter}){
  return (
    <>
      <div className="hcsquarediv" style={{background: '#000000'}}>{letter}</div>
      <button className="hcsquarebutt" style={{background: row_colors[0]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[1]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[2]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[3]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[4]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[5]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[6]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[7]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[8]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[9]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[10]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[11]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[12]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[13]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[14]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[15]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[16]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[17]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[18]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[19]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[20]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[21]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[22]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[23]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[24]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[25]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[26]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[27]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[28]}}></button>
      <button className="hcsquarebutt" style={{background: row_colors[29]}}></button>
      <div className="hcsquarediv" style={{background: '#000000'}}>{letter}</div>
    </>
  );
}

function HCBoard() {

  let rcs = [["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
             ["#612b0f", "#6b2710", "#752214", "#821f19", "#941e1e", "#9e1b20", "#af1e23", "#c62127", "#de1f26", "#eb1c24", "#ec1d23", "#ec1d25", "#ec1b2e", "#ed1a3b", "#ec1946", "#e91754", "#e51465", "#e21075", "#d80f83", "#d4148d", "#c82791", "#bb2d91", "#b33394", "#a83594", "#9f3894", "#933895", "#8c3d98", "#833d96", "#7d3e99", "#73419a"], 
             ["#884b1f", "#94441f", "#9c3f20", "#ad3f24", "#b93825", "#c62d27", "#d62827", "#e42024", "#eb2325", "#ec282a", "#ee2932", "#ee2932", "#ed2041", "#eb204d", "#ed1c5e", "#ec166e", "#ed0f7c", "#e90c8d", "#db2a92", "#cd3894", "#bf3e98", "#b43d97", "#a93c97", "#9e3e97", "#963d97", "#8d3d96", "#843e97", "#7d3e99", "#723d97", "#683b96"],
             ["#a66128", "#ac5b26", "#ba5a27", "#c24e27", "#cd4827", "#d64027", "#e23926", "#e83024", "#ee362c", "#ef3c40", "#ef3f4c", "#ee3b51", "#ee3a5d", "#ee3167", "#ee3078", "#ee2b87", "#eb3196", "#db4398", "#ca499b", "#bb4b9d", "#b4499b", "#a64799", "#9e4599", "#954398", "#8c4299", "#843e97", "#793d97", "#733c97", "#663996", "#5a3191"],
             ["#c9822a", "#d78228", "#dd7627", "#e87824", "#e66926", "#ea5d25", "#f1602b", "#ef5533", "#f04f3d", "#ef5651", "#f05d65", "#f05e6b", "#ee5871", "#f0537e", "#ef4f8b", "#f04f9d", "#df55a0", "#cd57a1", "#be5ea5", "#b658a2", "#a554a1", "#9b4e9e", "#944c9e", "#8d499e", "#82449a", "#7b4198", "#6f3e99", "#663795", "#583393", "#472e8a"],
             ["#e69c23", "#f1991e", "#f7921c", "#f68c1e", "#f68525", "#f4782e", "#f4773d", "#f36e45", "#f37052", "#f27767", "#f37674", "#f37781", "#f27789", "#f27094", "#f069a4", "#e76fac", "#d371ac", "#c771ae", "#bb71ae", "#ac67aa", "#9e5fa6", "#9359a5", "#8d54a3", "#8451a0", "#7a489d", "#6f459b", "#623e98", "#583393", "#492e8f", "#342b84"],
             ["#feb415", "#fcb122", "#faab2c", "#fbab3a", "#faa741", "#f9a34c", "#f69755", "#f58f5e", "#f48864", "#f58873", "#f58f83", "#f38f8f", "#f48e99", "#f48ca3", "#f287b5", "#e08dbb", "#d18bbd", "#c68cbe", "#b982b9", "#aa7ab6", "#9c74b3", "#9067ab", "#865ea7", "#7b59a6", "#7251a2", "#634a9e", "#5a429a", "#4c3293", "#392f8f", "#2c2978"],
             ["#fdc113", "#fdc029", "#fcb72c", "#fcb43b", "#fcb95e", "#f8ac56", "#faaa63", "#f9a26d", "#f7a279", "#f7a085", "#f69e94", "#f69d99", "#f59ea6", "#f69baa", "#f39dc2", "#e1a5cb", "#d0a6cc", "#cdadd2", "#b898c7", "#a88bc1", "#9a82bc", "#9a82bc", "#7f6eb2", "#7265ad", "#675ca8", "#5954a4", "#4f4ba0", "#44419a", "#313694", "#2b2f86"],
             ["#fcd017", "#fecd2a", "#ffc82f", "#fdc740", "#fec64b", "#fdbf58", "#fdbc60", "#fcb96b", "#fbb379", "#fab083", "#f9ae8e", "#f9b29e", "#f5b6ad", "#f3b6b5", "#ecb5c8", "#d8b7d6", "#cdb8d9", "#ccbddc", "#b4a9d3", "#a79fce", "#9794c9", "#8388c2", "#757dbc", "#6a75b7", "#5c6ab1", "#5161ae", "#4859a7", "#3e4fa1", "#2f449d", "#253a97"],
             ["#fce118", "#fcdc27", "#fcd933", "#fcd842", "#fcde4c", "#fed859", "#fddb60", "#fbd66b", "#f5db7c", "#f1e092", "#ecdc9e", "#e8e1b3", "#e1e0c2", "#dce1cb", "#d2e0d3", "#c6dde3", "#c1d9f1", "#c0d8f0", "#a7c8e9", "#99b9e0", "#8aaad9", "#7aa2d6", "#7093cb", "#6686c3", "#5679bb", "#4c6cb5", "#4262ad", "#3b5ba8", "#334fa2", "#27459d"],
             ["#f9ec24", "#f9eb2a", "#faeb36", "#f9ee46", "#f9f04d", "#f9f25c", "#f7f06b", "#efee82", "#e7eb8c", "#dee99d", "#d8e7ac", "#d3e8bf", "#d1e8cb", "#cde9d3", "#c7e6d6", "#bbe5e4", "#b3e2f2", "#b2e2f6", "#9edcf5", "#87d6f7", "#7dc7ee", "#71b5e4", "#65a8dc", "#5c97d1", "#518bca", "#4b7cbf", "#3f6eb6", "#3765b0", "#365bab", "#3050a3"],
             ["#f6ef3c", "#f6ef3f", "#f5ee46", "#f4ef4d", "#f1ec5a", "#ecec68", "#e6e87a", "#dfe784", "#d6e485", "#c8df8d", "#bedd97", "#b5dba2", "#b4dbaf", "#b0dab6", "#addbc1", "#aeddd7", "#aaddde", "#a8dde3", "#99d8e7", "#89d7ee", "#73d1f5", "#64cbf4", "#5aaadd", "#549dd4", "#4889c9", "#4889c9", "#3e7dc0", "#3b6fb8", "#3664af", "#335cab"],
             ["#f1ec21", "#f0eb2d", "#ebe932", "#e9e838", "#e5e643", "#dce453", "#d0df60", "#bfda67", "#b1d66d", "#a8d377", "#9fd07e", "#98d089", "#92ce98", "#8dcd9b", "#8ecfa7", "#8dcfb3", "#8ed1c0", "#8bd1c6", "#84cfcb", "#7acdd5", "#69cada", "#56c8e0", "#3bc6ef", "#38baec", "#3ca9e1", "#3b9ad4", "#4188c8", "#3879bd", "#3b6fb8", "#3465b1"],
             ["#e0e320", "#dbe127", "#d6e12f", "#cfdf37", "#c8db43", "#bad645", "#aed24c", "#9fcd51", "#90c958", "#85c65e", "#79c469", "#71c371", "#70c27a", "#6dc183", "#6dc183", "#70c493", "#70c59c", "#73c7a6", "#75c8ac", "#6bc6b4", "#60c6bb", "#54c4c5", "#47c3cf", "#30c2db", "#1bbae4", "#21aae1", "#289cd7", "#378ccc", "#317fc1", "#2c72b8"],
             ["#c2d82d", "#bdd630", "#b5d333", "#abcf39", "#a0cc39", "#94c93d", "#81c240", "#79c143", "#6dbc45", "#5db545", "#54b34b", "#4db254", "#46b859", "#49b869", "#50bb73", "#57bd7b", "#59bd7d", "#5cbf88", "#5fc08b", "#60c092", "#5bc09e", "#50c2ab", "#46c0b3", "#38bfc3", "#27bfcd", "#16b9d8", "#10aede", "#16a5dd", "#2395d3", "#2884c7"],
             ["#9ec439", "#9ac43c", "#94c23c", "#88bf40", "#7ebb42", "#6db343", "#63b144", "#54a846", "#4fa647", "#409e46", "#359d48", "#30a348", "#2aaa4b", "#2ab14b", "#31b454", "#37b65d", "#42b864", "#48b86e", "#48ba72", "#51bc76", "#52bd85", "#49bd90", "#45be9f", "#39bea9", "#2ebdb7", "#28bfc6", "#1bbdd2", "#0eb3d3", "#0ea8da", "#179fdb"],
             ["#7ba541", "#76a940", "#6fa744", "#65a243", "#59a445", "#4c9f45", "#439845", "#399645", "#299144", "#1e8943", "#198b43", "#149145", "#159a47", "#18a149", "#1bab4a", "#22b04c", "#2cb34c", "#33b555", "#3ab65e", "#3eb865", "#3fb970", "#39b97c", "#32ba8a", "#2cb996", "#21bba1", "#1cbaac", "#18bcbd", "#14bcc7", "#10b7d7", "#0fb1e2"],
             ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"]];

  return (
    <>
      <div className="hcboard-row">
        <ScoreRows />
      </div>
      <div className="hcboard-row">
        <TopRow lh={'26px'}/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[1]} letter="A" />
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[2]} letter="B"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[3]} letter="C"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[4]} letter="D"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[5]} letter="E"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[6]} letter="F"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[7]} letter="G"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[8]} letter="H"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[9]} letter="I"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[10]} letter="J"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[11]} letter="K"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[12]} letter="L"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[13]} letter="M"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[14]} letter="N"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[15]} letter="O"/>
      </div>
      <div className="hcboard-row">
        <HCRow row_colors={rcs[16]} letter="P"/>
      </div>
      <div className="hcboard-row">
        <TopRow lh="15px" />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <HCBoard />
    </>
  );
}

export default App;
