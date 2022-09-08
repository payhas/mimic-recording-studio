import React, { Component } from "react";
import { ReactMic as Visualizer } from "react-mic";
import Recorder from "./components/Recorder";
import PhraseBox from "./components/PhraseBox";
import Metrics from "./components/Metrics";
import hark from "hark";
import Wave from "./components/Wave";

// import microphoneSVG from './assets/microphone.svg'
import spacebarSVG from "./assets/space.svg";
import PSVG from "./assets/P.svg";
import rightSVG from "./assets/right.svg";
import SSVG from "./assets/S.svg";

import { postAudio, getPrompt, getUser, createUser, getAudioLen } from "./api";
import { getUUID, getName } from "./api/localstorage";

class Record extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userCreated: false,
      shouldRecord: false,
      displayWav: false,
      blob: undefined,
      play: false,
      prompt: "*error loading prompt... is the backend running?*",
      language: "",
      promptNum: 0,
      totalTime: 0,
      totalCharLen: 0,
      audioLen: 0,
      showPopup: true
    };

    this.uuid = getUUID();
    this.name = getName();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.requestUserDetails(this.uuid);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  render() {
    return (
      <div id="PageRecord">
        <h1>Ses Ýazgy Merkezi</h1>
        <TopContainer
          userName={this.name}
          route={this.props.history.push}
          show={this.state.showPopup}
          dismiss={this.dismissPopup}
        />
        <Metrics
          totalTime={this.state.totalTime}
          totalCharLen={this.state.totalCharLen}
          promptNum={this.state.promptNum}
          totalPrompt={this.state.totalPrompt}
        />
        <PhraseBox
          prompt={this.state.prompt}
          promptNum={this.state.promptNum}
          audioLen={this.state.audioLen}
          totalCharLen={this.state.totalCharLen}
          totalTime={this.state.totalTime}
        />
        <div className="wave-container" id="container">
          {this.state.displayWav ? this.renderWave() : this.renderVisualizer()}
          <Recorder
            command={this.state.shouldRecord ? "start" : "stop"}
            onStart={() => this.shoulddisplayWav(false)}
            onStop={this.processBlob}
            gotStream={this.silenceDetection}
          />
        </div>
        <div className="indicator-container">
          {this.state.shouldRecord
            ? "Ýazgyny okaň, duruzmak üçin [Esc]"
            : "[Boşluk] Ýazga başlamak üçin [R] Ýazgyny diňlemek üçin [S] Geçmek üçin [->] Indiki üçin"}
        </div>
        <div id="controls">
          <a
            id="btn_Play"
            className={`btn btn-play ${
              this.state.shouldRecord
                ? "btn-disabled"
                : this.state.blob === undefined
                ? "btn-disabled"
                : this.state.play
                ? "btn-disabled"
                : null
            } `}
            onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.playWav}
          >
            <i className="fas fa-play ibutton" />
            Diňle
          </a>
          <a
            id="btn_Next"
            className={`btn-next ${
              this.state.shouldRecord
                ? "btn-disabled"
                : this.state.blob === undefined
                ? "btn-disabled"
                : this.state.play
                ? "btn-disabled"
                : null
            }`}
            onClick={this.state.shouldRecord ? () => null : this.state.play ? () => null : this.onNext}
          >
            <i className="fas fa-forward ibutton-next" />
            Indiki
          </a>
        </div>
      </div>
    );
  }

  dismissPopup = () => {
    this.setState({
      showPopup: false
    });
  };

  requestPrompts = uuid => {
    getPrompt(uuid)
      .then(res => res.json())
      .then(res => {
        if (res.data.prompt === "___CORPUS_END___") {
            this.setState({
              shouldRecord: false,
              prompt: "*başga ýazgy galmady*",
              totalPrompt: res.data.total_prompt
            })
          }
        if (res.success && res.data.prompt !== "___CORPUS_END___") {
        this.setState({
          prompt: res.data.prompt,
          totalPrompt: res.data.total_prompt
        });
        }
      });
  };

  requestUserDetails = uuid => {
    getUser(uuid)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            userName: res.data.user_name,
            language: res.data.language,
            promptNum: res.data.prompt_num,
            totalTime: res.data.total_time_spoken,
            totalCharLen: res.data.len_char_spoken
          });
          this.requestPrompts(this.uuid);
        } else {
          if (this.uuid) {
            createUser(this.uuid, this.name)
              .then(res => res.json())
              .then(res => {
                if (res.success) {
                  this.setState({ userCreated: true });
                  this.requestPrompts(this.uuid);
                } else {
                  alert("ulanyjy döredilýärkä säwlik ýüze çykdy");
                }
              });
          } else {
            alert("ulanyjy döredilýärkä säwlik ýüze çykdy");
          }
        }
      });
  };

  renderWave = () => (
    <Wave
      className="wavedisplay"
      waveColor="#FD9E66"
      blob={this.state.blob}
      play={this.state.play}
      onFinish={this.stopWav}
    />
  );

  renderVisualizer = () => (
    <Visualizer
      className="wavedisplay"
      record={this.state.shouldRecord}
      backgroundColor={"#222222"}
      strokeColor={"#FD9E66"}
    />
  );

  processBlob = blob => {
    getAudioLen(this.uuid, blob)
      .then(res => res.json())
      .then(res =>
        this.setState({
          audioLen: res.data.audio_len
        })
      );
    this.setState({
      blob: blob
    });
    this.shoulddisplayWav(true);
  };

  shoulddisplayWav = bool => this.setState({ displayWav: bool });

  playWav = () => this.setState({ play: true });

  stopWav = () => this.setState({ play: false });

  handleKeyDown = event => {
    // space bar code
    if (event.keyCode === 32) {
      if (!this.state.shouldRecord) {
        event.preventDefault();
        this.recordHandler();
      }
    }

    // esc key code
    if (event.keyCode === 27) {
      event.preventDefault();

      // resets all states
      this.setState({
        shouldRecord: false,
        displayWav: false,
        blob: undefined,
        promptNum: 0,
        totalTime: 0,
        totalCharLen: 0,
        audioLen: 0,
        play: false
      });
    }

    // skip current phrase (S)
    if (event.keyCode === 83) {
      this.skipCurrent();
    }

    // play wav
    if (event.keyCode === 82) {
      this.playWav();
    }

    // next prompt
    if (event.keyCode === 39) {
        if (!this.state.play) {
          this.onNext();
        }
     }
  };

  recordHandler = () => {
    setTimeout(() => {
      this.setState((state, props) => {
        return {
          shouldRecord: true,
          play: false
        };
      });
    }, 500);
  };

  onNext = () => {
    if (this.state.blob !== undefined) {
      postAudio(this.state.blob, this.state.prompt, this.uuid)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            this.setState({ displayWav: false });
            this.requestPrompts(this.uuid);
            this.requestUserDetails(this.uuid);
            this.setState({
              blob: undefined,
              audioLen: 0
            });
          } else {
            alert("Ýazgy girizilýärkä säwlik ýüze çykdy");
          }
        })
        .catch(err => console.log(err));
    }
  };

  skipCurrent = () => {
    // Send static text '___SKIPPED___' as prefix to original phrase to backend API for being filtered out.
    postAudio("", "___SKIPPED___" + this.state.prompt, this.uuid)
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        this.setState({ displayWav: false });
        this.requestPrompts(this.uuid);
        this.requestUserDetails(this.uuid);
        this.setState({
          blob: undefined,
          audioLen: 0
        });
      } else {
        alert("Ýazgy girizilýärkä säwlik ýüze çykdy");
      }
    })
    .catch(err => console.log(err));
  };

  silenceDetection = stream => {
    const options = {
      interval: "150",
      threshold: -80
    };
    const speechEvents = hark(stream, options);

    speechEvents.on("stopped_speaking", () => {
      this.setState({
        shouldRecord: false
      });
    });
  };
}

class TopContainer extends Component {
  render() {
    return this.props.show ? this.renderContainer() : null;
  }

  renderContainer = () => {
    return (
      <div className="top-container">
        <div className="top-container-info">
          <div className="instructions2">
            <i className="fas fa-info-circle" />
            <h2>Ýatlatma:</h2>
            <ul className="hints">
              <li>
                <img src={spacebarSVG} className="key-icon" alt="space" /> Ýazgyny başladýar
              </li>
              <li>Gürläp bolanyňyzdan soň ýazgy awtomat duruzylar</li>
              <li>
                <img src={PSVG} className="key-icon" alt="p" /> Ýazgyny diňleder
              </li>
              <li>
                <img src={rightSVG} className="key-icon" alt="->" /> Indiki ýazga geçer
              </li>
              <li>
                <img src={SSVG} className="key-icon" alt="->" /> Şu wagtky ýazgyny goýbolsun edip, indiki ýazga geçer
              </li>
            </ul>
          </div>
          <div className="session-info">
            <div className="top-info">
              <div>
                <h2>Ýazyjy</h2>
                &nbsp;
                <span id="sessionName">{this.props.userName}</span>
              </div>
              <div className="btn-restart" />
            </div>
            <hr />
            <p>
              Ýazgy edilen sözleriň {" "}
              <span className="highlight">
                görkezilen tekst bilen gabap gelmegi hökmandyr
              </span>
              . Egerde ýazgy edilen sözleriň dogrylygyna doly göwniňiz ýetmese,
              sözleri hökman täzeden ýazgy ediň.
            </p>
          </div>
        </div>
        <button className="btn info-btn" onClick={this.handleClick}>
          Gollanma
        </button>
        <button className="btn info-btn" onClick={this.props.dismiss}>
          Dowam Et
        </button>
      </div>
    );
  };

  handleClick = () => {
    this.props.route("/tutorial");
  };
}

export default Record;
