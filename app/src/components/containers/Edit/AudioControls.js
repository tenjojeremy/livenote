import React from 'react';
import styled from 'styled-components'
import Pause_icon from '../../../images/icons/PauseCircle.svg';
import Play_icon from '../../../images/icons/PlayCircle.svg';
import Slider from 'material-ui/Slider';
import {withRouter} from 'react-router-dom'
import Note_icon from '../../../images/icons/Note.svg';
import Camera_icon from '../../../images/icons/Camara.svg';

//State
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Set_Audio_Control, Set_Current_Time, Toggle_NewNote, Toggle_NewNote_Image} from '../../../state/actions/index';

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    Set_Audio_Control,
    Set_Current_Time,
    Toggle_NewNote,
    Toggle_NewNote_Image
  }, dispatch)
}
// Set global state to prop
function mapStateToProps(state) {
  return {noteID: state.PlaybackSelection_ID, recTime: state.RecTime}
}

class PlaybackOptions extends React.Component {

  //initial state
  constructor(props) {
    super(props)
    this.state = {
      audioSrc: props.audioSrc,
      pauseToggle: false,
      playToggle: true,
      audioControl: '',
      sliderPos: 0,
      min: 0,
      minValue: 0,
      max: 10000
    }
    this.initPlayback = this.initPlayback.bind(this);
  }

  //Methods
  componentWillMount() {
    // console.log(this.state.audioSrc);
    this.initPlayback(this.state.audioSrc);
    // this.initPlayback(this.props.noteID);
  }
  componentWillUnmount() {
    if (this.state.audioControl) {
      let audioControl = this.state.audioControl;
      audioControl.pause();
    }

  }

  initPlayback = (audioSrc) => {

    let audioControl = new Audio([audioSrc])
    // audioControl.play()

    this.props.Set_Audio_Control(audioControl)

    this.setState({audioControl: audioControl})

    audioControl.onended = (e) => {
      this.setState({playToggle: true, pauseToggle: false});
      audioControl.currentTime = 0
    }

    audioControl.onloadedmetadata = (e) => {
      // console.log(audioControl.duration);
      this.setState({max: audioControl.duration})
    }

    audioControl.ontimeupdate = (e) => {
      this.setState({sliderPos: audioControl.currentTime, minValue: audioControl.currentTime})
    }
  }

  handleSlider = (event, value) => {
    this.setState({sliderPos: value})
    let audioControl = this.state.audioControl
    audioControl.currentTime = value
    this.props.Set_Current_Time(audioControl.currentTime)

  }

  resume = () => {
    this.setState({playToggle: false, pauseToggle: true});
    let audioControl = this.state.audioControl;
    audioControl.play()

  }

  pause = () => {
    this.setState({playToggle: true, pauseToggle: false})
    let audioControl = this.state.audioControl
    audioControl.pause()
  }

  showNote = () => {
    //set current time
    // console.log(this.state.sliderPos);
    let getMinutes = Math.floor(this.state.sliderPos / 60)
    let getSeconds = ('0' + Math.floor(this.state.sliderPos) % 60).slice(-2)
    let time = {
      time: getMinutes + ':' + getSeconds,
      timeSeconds: this.state.sliderPos
    }

    // console.log(time)
    this.props.Set_Current_Time(time)
    this.props.Toggle_NewNote('show')
  }

  imageSelected = (event) => {

    //Preview image
    if (event.target.value !== '') {
      //set current time
      let getMinutes = Math.floor(this.state.sliderPos / 60)
      let getSeconds = ('0' + Math.floor(this.state.sliderPos) % 60).slice(-2)
      let time = {
        time: getMinutes + ':' + getSeconds,
        timeSeconds: this.state.sliderPos
      }
      this.props.Set_Current_Time(time);
      this.props.Toggle_NewNote_Image('show');

      var preview = document.querySelector('#PreviewImage');
      var file = event.target.files[0]
      var reader = new FileReader();

      reader.addEventListener("load", () => {
        preview.src = reader.result
      }, false);

      if (file) {
        reader.readAsDataURL(file)
      }

    }
  }

  getMinutes = () => Math.floor(this.state.sliderPos / 60);

  getSeconds = () => ('0' + Math.floor(this.state.sliderPos) % 60).slice(-2);

  getMinutesFinal = () => Math.floor(this.state.max / 60);

  getSecondsFinal = () => ('0' + Math.floor(this.state.max) % 60).slice(-2);

  render() {
    //Properties

    //Template
    return (
      <Wrapper>
        <TimeBar>
          <SliderCon>
            <Slider style={{
              paddingLeft: '10px',
              paddingRight: '10px'
            }} value={this.state.sliderPos} onChange={this.handleSlider} min={this.state.min} max={this.state.max} step={1}/>
          </SliderCon>
          <StartTime>{this.getMinutes()}:{this.getSeconds()}</StartTime>
          <EndTime>{this.getMinutesFinal()}:{this.getSecondsFinal()}</EndTime>
        </TimeBar>
        <OptionsCon>
          <OptionsConInner>

            <Noteicon src={Note_icon} onClick={this.showNote}/>

            <PauseIcon onClick={this.pause} src={Pause_icon} pauseToggle={this.state.pauseToggle}/>
            <PlayIcon onClick={this.resume} src={Play_icon} playToggle={this.state.playToggle}/>

            <CamaraIcon >
              <label htmlFor="file-input">
                <Icon src={Camera_icon}/>
              </label>
              <FileInput id="file-input" type="file" accept="image/*" onChange={this.imageSelected}/>
            </CamaraIcon>

          </OptionsConInner>
        </OptionsCon>
      </Wrapper>
    );
  }

}

//Style

const PauseIcon = styled.img `
		width: 90px;
		display: ${props => props.pauseToggle
  ? 'block'
  : 'none'};
			cursor: pointer;
      margin-top: -15px;
      transform: translateX(-19px);

		`;
const PlayIcon = styled.img `
		width: 90px;
		display: ${props => props.playToggle
  ? 'block'
  : 'none'};
			cursor: pointer;
      margin-top: -15px;
      transform: translateX(-19px);

		`;

const Wrapper = styled.div `
	display: grid;
	grid-template-rows: 50px 100px;
	background: #0F2331;
`;
const TimeBar = styled.div `
position: relative;

 `;
const SliderCon = styled.div `
   ${ ''/* background: green; */}
  `;

const OptionsCon = styled.div `
width: 100%;

 `;
const OptionsConInner = styled.div `
width: 180px;
margin: 0 auto;
display: grid;
grid-template-columns: 50px 40px 50px;
grid-column-gap: 20px;
margin-top: 20px;
 `;

const StartTime = styled.p `
position: absolute;
left: 0;
top: 50px;
bottom: 0;
font-size: 14px;
margin: 0;
left: 10px;
 `;
const EndTime = styled.p `
position: absolute;
right: 0;
top: 50px;
bottom: 0;
font-size: 14px;
margin: 0;
right: 10px
 `;

const CamaraIcon = styled.div `
width: 50px;
  `;
const Noteicon = styled.img `
  width: 50px;
  `;
const Icon = styled.img `

   `;
const FileInput = styled.input `
  display: none;
  	  `;
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaybackOptions));
