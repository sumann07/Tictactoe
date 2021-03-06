import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./Row";
import "./App.css";

var symbolsMap = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

var patterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  
  [0, 4, 8],
  [2, 4, 6]
];

var AIScore = { 2: 1, 0: 2, 1: 0 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true,
      mode: "AI"
    };
    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.processBoard = this.processBoard.bind(this);
    this.makeAIMove = this.makeAIMove.bind(this);
  }

  processBoard() {
    var won = false;
    patterns.forEach(pattern => {
      var firstMark = this.state.boardState[pattern[0]];

      if (firstMark != 2) {
        var marks = this.state.boardState.filter((mark, index) => {
          return pattern.includes(index) && mark == firstMark; 
        });

        if (marks.length == 3) {
          document.querySelector("#message1").innerHTML =
            String.fromCharCode(symbolsMap[marks[0]][1]) + " wins!";
          document.querySelector("#message1").style.display = "block";
          pattern.forEach(index => {
            var id = index + "-" + firstMark;
            document.getElementById(id).parentNode.style.background = "#d4edda";
          });
          this.setState({ active: false });
          won = true;
        }
      }
    });

    if (!this.state.boardState.includes(2) && !won) {
      document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#message2").style.display = "block";
      this.setState({ active: false });
    } else if (this.state.mode == "AI" && this.state.turn == 1 && !won) {
      this.makeAIMove();
    }
  }

  makeAIMove() {
    var emptys = [];
    var scores = [];
    this.state.boardState.forEach((mark, index) => {
      if (mark == 2) emptys.push(index);
    });

    emptys.forEach(index => {
      var score = 0;
      patterns.forEach(pattern => {
        if (pattern.includes(index)) {
          var xCount = 0;
          var oCount = 0;
          pattern.forEach(p => {
            if (this.state.boardState[p] == 0) xCount += 1;
            else if (this.state.boardState[p] == 1) oCount += 1;
            score += p == index ? 0 : AIScore[this.state.boardState[p]];
          });
          if (xCount >= 2) score += 10;
          if (oCount >= 2) score += 20;
        }
      });
      scores.push(score);
    });

    var maxIndex = 0;
    scores.reduce(function(maxVal, currentVal, currentIndex) {
      if (currentVal >= maxVal) {
        maxIndex = currentIndex;
        return currentVal;
      }
      return maxVal;
    });
    this.handleNewMove(emptys[maxIndex]);
  }

  handleReset(e) {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));
    this.setState({
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true
    });
  }
  handleNewMove(id) {
    this.setState(
      prevState => {
        return {
          boardState: prevState.boardState
            .slice(0, id)
            .concat(prevState.turn)
            .concat(prevState.boardState.slice(id + 1)),
          turn: (prevState.turn + 1) % 2
        };
      },
      () => {
        this.processBoard();
      }
    );
  }

  handleModeChange(e) {
    e.preventDefault();
    if (e.target.getAttribute("href").includes("AI")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      this.setState({ mode: "AI" });
      this.handleReset(null);
    } else if (e.target.getAttribute("href").includes("2P")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#ai").style.background = "none";
      this.setState({ mode: "2P" });
      this.handleReset(null);
    }
  }

  render() {
    const rows = [];
    for (var i = 0; i < 3; i++)
      rows.push(
        <Row
          row={i}
          boardState={this.state.boardState}
          onNewMove={this.handleNewMove}
          active={this.state.active}
        />
      );
    return (
      <div className="main">

        <div class="container" >
        <div className="choose">
         
          <img className="image-1" src="https://lh3.googleusercontent.com/proxy/Z4gWFUq_b583bpVbeO8TD_SoZk6mIRaYJEeXVoDZPSXWJ7IE9kZp1xsQ9W0cfdPSZ3CXfbkBBa33rrUwQPlWKyrpnsIzXYkL1gNJ" alt=""/>
          <img className="image-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/O-Train_icon.png/481px-O-Train_icon.png" alt=""/>  
            <div className="heading">Choose your play mode</div>
            <div className="btn">
          <button className="button-1">
            <a href="./?AI" onClick={this.handleModeChange} id="ai">
              With AI
            </a></button>{" "}
            
           <button className="button-2">
              <a href="./?2P" onClick={this.handleModeChange} id="twop">
              {" "}
              With a friend
            </a></button><br></br>{" "}
<img className="setting" src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/16636837041579252561-512.png" alt=""/>
            </div>
            
          </div>
          
          </div>
        <div className="container jumbotron" id="container">
          
         
          
          
          <div>
            <div className="board">{rows}</div>
          <p className="alert alert-success" role="alert" id="message1"></p>
          <p className="alert alert-info" role="alert" id="message2"></p>
        </div>
        <button className="button" onClick={this.handleReset} >
              {" "}
              Reset
            </button>
      </div>
      </div>
    );
  }
}

export default App;