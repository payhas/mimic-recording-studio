import React, { Component } from "react";
import PhraseBox from "./components/PhraseBox";
import { ReactMic as Visualizer } from "react-mic";
import spacebarSVG from "./assets/space.svg";
import PSVG from "./assets/P.svg";
import rightSVG from "./assets/right.svg";
import SSVG from "./assets/S.svg";

class Tutorial extends Component {
  render() {
    return (
      <div className="App">
        <h1>Gollanma</h1>
        <div className="tutorial">
            "Ses Ýazgy Merkezi" akylly ses kömekçisi üçin niýetlenen
            ses ýazgylaryny ýygnama prosesini aňsatlaşdyrmak üçin döredilendir.
            <br />
            <br />
            <div>
            <h2>Ýazgy bölümi</h2>
            <PhraseBox
                prompt="Akja, çyralary ýak."
                promptNum={0}
                audioLen={0}
                totalCharLen={0}
                totalTime={0}
            />
            <Visualizer
                className="wavedisplay"
                record={false}
                backgroundColor="#222222"
                strokeColor="#FD9E66"
            />
            <p>
                Orta arada, ýazgy edilmeli sözlem görkezilendir,
                ýazga başlamak üçin klawiýaturada &nbsp;
                <img src={spacebarSVG} className="key-icon" alt="space" /> &nbsp;
                "Boşluk" knopkasyna basyň. Gürlap bolanyňyzdan soň, ýazgy awtomatiki duruzylar.
                Edilen ses ýazgysyny diňlemek üçin &nbsp;
                <img src={PSVG} className="key-icon" alt="p" /> &nbsp;
                knopkasyna basyň. Islendik sözlemleri täzeden hem ýazgy edip bilersiňiz.
                <b>Ýazgy edilen sözleriň, görkezilen tekst bilen gabap gelmegi hökmandyr. </b>
                Egerde ýazgy edilen sözleriň dogrylygyna doly göwniňiz ýetmese,
                sözleri hökman täzeden ýazgy ediň. Ýazgy girizilenden soň yzyna gaýtarmak mümkin däldir.
                Ýazgyny goýbolsun etmek üçin <img src={SSVG} className="key-icon" alt="s" /> knopkasyna basyň,
                bu sizi indiki sözleme geçirer. Ýazgyny girizmek we indiki sözleme geçmek üçin bolsa &nbsp;
                <img src={rightSVG} className="key-icon" alt="->" />&nbsp; knopkasyna basyň.
            </p>
          </div>
          <div>
              <h2>Gürleýiş depgini</h2>
              <p>
              Ýazga almak bes edilende, ýazgy gutusynyň ýokarky sag burçunda gürleýiş depgini görkezijisini görüp bilersiňiz.
              Bu görkeziji siziň çalt, haýal ýa-da gowy tizlik bilen gürleýändigiňizi görkezer.
              </p>
              <div className="grid-layout">
                <div className="feedback-ball-green-t">Durnukly Tizlik</div>
                <div className="feedback-ball-red-t">Ýuwaş Tizlik</div>
                <div className="feedback-ball-red-t">Çalt Tizlik</div>
              </div>
              <p><b>Görkeziji ortaça gürleýiş tizligiňizi ulanyp kesgitlenýär. Görkeziji diňe 100 ýazylan nusgadan soň peýda bolup başlar.
              </b>
            </p>
          </div>
          <div>
              <button className="btn" onClick={this.handleClick}>Ýazga Geç</button>
          </div>
        </div>
      </div>
    );
  }

  handleClick = () => {
      this.props.history.push("/record")
  }

}

export default Tutorial;
