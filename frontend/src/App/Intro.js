import React, { Component } from "react";
// import { history } from "react-router-dom";
import { getName, saveName, createUUID, clearName } from "./api/localstorage";

class Intro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: undefined
    };
  }

  componentDidMount() {
    const name = getName();
    if (name) {
      this.setState({ name });
    }
  }

  render() {
    return (
      <div className="page-intro">
        <div id="PageIntro">
          <h2 style={{ color: "#FD9E66" }}>Ses Ýazgy Merkezi</h2>
          <h1>Geliň "AKJA" ses kömekçisini bilelikde döredeliň!</h1>
          <p>
            "AKJA" öý we ofis otaglarynda ulanmak üçin niýetlenen, ses kömekçisi bolup,
            onuň üsti bilen akylly enjamlary dolandyryp bolar.
          </p>
          <p>
            "Ses Ýazgy Merkezi" bolsa, programmanyň adam sesine düşünmek üçin gerekli bolan
            ses ýazgylaryny ýygnamak üçin niýetlenendir.
          </p>

          <div className="instructions">
            <i className="fas fa-book-open" />
            <h2>gollanma</h2>
            <p>
              AKJA, ses ýazgylaryndan ritmi, äheňi we aýdylyşy saklaýar.
              Netijede, ähli ýazgylarda, soňky önümiň şahsyýeti üçin durnukly ses ulanmak möhümdir.
            </p>

            <p>
              Bu meselede şu bellikler göz öňünde tutlmaly:
            </p>

            <ul className="persona-desc">
              <li>
                <span className="li-title">
                  Kömekçi bilimli we ynamly, ýöne kiçigöwünlidir.
                </span>
                <br /> Kömekçi üçin dünýäniň ähli maglumatlary elýeter,
                  ýöne şeýlede bolsa özüniň çäklidigini bilýär we düzedilmegine garşy däl.
              </li>
              <li>
                <span className="li-title">
                  Kömekçi bilimleri gowy görýär we beýlekiler bilen maglumat paýlaşmagy gowy görýär.
                </span>
                <br /> Bu lezzet, sesindäki güýç we joşgun bilen aýdyň eşidilýär.
              </li>
              <li>
                <span className="li-title">
                  Kömekçi tutanýerli, optimistik we göwünjeň.
                </span>
                <br /> Ýalňyşlyklar ýa-da düşünişmezlikler bolan ýagdaýynda hem,
                  göwnüçökgünlik alamaty bolmazdan, kömekçi sesi oňyn bolmaly.
              </li>
              <li>
                <span className="li-title">
                  Kömekçi gaty ýa-da aşa resmi bolmaly däl.
                </span>
                <br /> Kömekçi, habarlar labyryndan eşidip boljak ýaly täsirli,
                  ýöne gyssagly bolmadyk depginde bilen gürleýär.
              </li>
            </ul>

            <hr></hr>
            <p>
              Mundan başga-da, ses ýazgylaryňyz üçin bu maslahatlary ýerine ýetiriň:
            </p>
            <ul className="persona-desc">
              <li><b>Ýokary hilli mikrofon ulanyň we asuda ýazgy otagyny gurnaň</b></li>
              <li>Tebigy gürleýiş akymy bilen okaň we harplary ýuwutmaň.</li>
              <li>Dyngy belgiler bilen äheňi sazlaň.</li>
              <li>Durnukly ýazgy tizligini ulanyň.</li>
              <li>Fon sesleri üçin ýazgylaryňyzy ýokary ses bilen yzygiderli barlap duruň.</li>
              <li>Yzygiderli arakesme ediň we günde dört sagatdan köp ýazmaň.</li>
              <li>Ýalňyşlyksyz ýazgy ediň.</li>
              </ul>

              <span className="li-title">Üstünlikli ýazgylar :-)</span>

          </div>
          {getName() ? this.renderWelcomeBackMsg() : this.renderInput()}
          <div className="btn_PageIntro">
            <button
              id="btn_PageIntro"
              className="btn"
              onClick={this.handleTrainMimicBtn}
            >
            Ýazga Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderInput = () => {
    return (
      <div>
        <p>Başlmak üçin adynyňyzy giriziň we "Ýazga Başla" dügmesine basyň.</p>
        <input
          type="text"
          id="yourname"
          placeholder="Adyňyz"
          onChange={this.handleInput}
        />
      </div>
    );
  };

  renderWelcomeBackMsg = () => {
    return (
      <div>
        <p>Hoş geldiňiz {this.state.name}!</p>
        <div className="btn-restart">
          <a href="/" onClick={this.handleRestartBtn}>
            Täze Ýazyjy Başlat
          </a>
        </div>
        <br/><br/>
        <p>Ýazga dowam etmek üçin, "Ýazga Başla" dügmesine basyň</p>
      </div>
    );
  };

  handleInput = e => {
    this.setState({ name: e.target.value });
  };

  handleTrainMimicBtn = () => {
    if (this.state.name === undefined) {
      alert("Dowam etmezden ozal, adynyňyzy giriziň!");
    } else {
    saveName(this.state.name);
    this.props.history.push('/record')
    }
  };

  handleRestartBtn = e => {
    createUUID();
    clearName();
    this.setState({ name: undefined });

    e.preventDefault();
  };
}

export default Intro;
