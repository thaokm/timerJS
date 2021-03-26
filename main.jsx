class Controls extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="col controls">
                <div className="row justify-content-center" style={{height: "25%"}}>
                    <div id={this.props.ctrlType+"-label"} className="col">
                        set {this.props.ctrlType} length
                    </div>
                </div>
                <div className="row justify-content-center align-items-center" style={{height: "50%"}}>
                    <button id={this.props.ctrlType+"-decrement"} className="control-btn" onClick={this.props.click} value="-">
                        <i className="fa fa-minus"></i>
                    </button>
                    <div id={this.props.ctrlType+"-length"} className="col-5 control-length">
                        {this.props.length}
                    </div>
                    <button id={this.props.ctrlType+"-increment"} className="control-btn" onClick={this.props.click} value="+">
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <div className="row" style={{height: "50%"}}>    
                    <div className="col-12">minute(s)</div>
                </div>
            </div>
        );
    }
}

const playBtn = <i className="fa fa-play"></i>;
const pauseBtn = <i className="fa fa-pause"></i>;
const normalStyle = {color: 'royalblue'};
const warnStyle = {color: 'red'};
const defaultState = {
    breakLength : 5,
    sessionLength: 25,
    running: 'stop',
    type: 'session',
    timeleft: 1500,
    intervalID: undefined,
    timerStyle: normalStyle
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
        this.start = this.start.bind(this);
        this.reset = this.reset.bind(this);
        this.changeBreak = this.changeBreak.bind(this);
        this.changeSession = this.changeSession.bind(this);
        this.timer = this.timer.bind(this);
    }
    timer() {
        let currentTimeleft = this.state.timeleft;
        if (currentTimeleft > 0) {
            if (currentTimeleft < 10) {
                this.setState({
                    timeleft: currentTimeleft - 1,
                    timerStyle: warnStyle
                });    
            } else {
                this.setState({
                    timeleft: currentTimeleft - 1
                });    
            }
        } else {
            // clearInterval(this.state.intervalID);
            console.log('time out. next phase');
            this.audioBeep.play();
            let newType = this.state.type == 'session' ? 'break' : 'session';
            let newTimeleft = newType == 'session' ? this.state.sessionLength*60 : this.state.breakLength*60;
            this.setState({
                type: newType,
                timeleft: newTimeleft,
                timerStyle: normalStyle
            });
        }
    }
    start() {
        if (this.state.running != 'running') {
            console.log('running');
            let iD = setInterval(this.timer, 50);
            this.setState({
                running: 'running',
                intervalID: iD
            });
            
        } else {
            console.log('stop');
            clearInterval(this.state.intervalID);
            this.setState({
                running: 'stop',
                intervalID: undefined
            });
        }
    }
    reset() {
        console.log('reset');
        clearInterval(this.state.intervalID);
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
        this.setState(defaultState);
    }
    changeBreak(e) {
        let change = e.currentTarget.value == '+' ? 1 : -1;
        let currentBreakLength = this.state.breakLength;
        if (this.state.running != 'running') {
            if ((currentBreakLength<2 && change==-1) || (currentBreakLength>59 && change==1)) {
                // khonng lam gi
            } else {
                this.setState({breakLength : currentBreakLength + change});
            }
        }
    }
    changeSession(e) {
        let change = e.currentTarget.value == '+' ? 1 : -1;
        let currentSessionLength = this.state.sessionLength;
        if (this.state.running != 'running') {
            if ((currentSessionLength<2 && change==-1) || (currentSessionLength>59 && change==1)) {
                // khonng lam gi
            } else {
                let newLength = currentSessionLength + change;
                this.setState({
                    sessionLength : newLength,
                    timeleft: newLength * 60
                });
            }
        }
    }
    playPause() {
        if (this.state.running == 'stop') {
            return playBtn
        } else {
            return pauseBtn
        }
    }
    convertMMSS(timeleft) {
        let s = timeleft % 60;
        let m = (timeleft - s) / 60;
        let mm = m < 10 ? '0' + m.toString() : m.toString();
        let ss = s < 10 ? '0' + s.toString() : s.toString();
        return mm + ':' + ss;
    }
    render() {
        return(
            <div id="main" className="container text-center">
                <div id="header" className="row">
                    <div className="col">
                    JS Timer
                    </div>
                </div>
                <div id="control-row" className="row justify-content-center">
                    <Controls ctrlType="break" length={this.state.breakLength} click={this.changeBreak} />
                    <Controls ctrlType="session" length={this.state.sessionLength} click={this.changeSession} />
                </div>
                <div id="timer-row" className="row">
                    <div id="timer-container" className="col">
                        <div className="row justify-content-center align-items-center" style={{height: "75%"}}>
                            <button id="start_stop" className="timer-control" onClick={this.start}>
                                {this.playPause()}
                            </button>
                            <div id="time-left" className="col-6" style={this.state.timerStyle}>
                                {this.convertMMSS(this.state.timeleft)}
                            </div>
                            <button id="reset" className="timer-control" onClick={this.reset}>
                                <i className="fa fa-stop"></i>
                            </button>
                        </div>
                        <div className="row" style={{height: "25%"}}>
                            <div id="timer-label" className="col">
                                status: {this.state.type} {this.state.running}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="footer" className="row align-items-end">
                    <div className="col">
                    <i className="fa fa-copyright"></i> 2021 thao.km
                    </div>
                </div>
                <audio id="beep" 
                    preload="auto" 
                    ref={(audio) => {
                        this.audioBeep = audio;
                      }}
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>            
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));