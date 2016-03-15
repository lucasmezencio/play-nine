var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { 
    return true;
  }

  if (arr[0] > n) { 
    return false;
  }

  if (arr[arr.length - 1] > n) {
    arr.pop();

    return possibleCombinationSum(arr, n);
  }

  var listSize = arr.length, combinationsCount = (1 << listSize)

  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;

    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { 
        combinationSum += arr[j]; 
      }
    }

    if (n === combinationSum) { 
      return true; 
    }
  }

  return false;
};

// STARS
var StarsFrame = React.createClass({
  render: function () {
    var stars = [];

    for (var i = 0; i < this.props.numberOfStars; i++) {
      stars.push(
        <span className="glyphicon glyphicon-star" key={i}></span>
      );
    }

    return (
      <div id="stars-frame">
        <div className="well">
         {stars}
        </div>
      </div>
    );
  }
});

// BUTTON
var ButtonFrame = React.createClass({
  render: function () {
    var disabled = (this.props.selectedNumbers.length === 0);
    var className = 'primary';
    var icon = '=';
    var correct = this.props.correct;
    var click = this.props.checkAnswer;

    switch(correct) {
      case true:
        click = this.props.acceptAnswer;
        className = 'success';
        icon = (
          <span className="glyphicon glyphicon-ok"></span>
        );

        break;
      case false:
        className = 'danger';
        icon = (
          <span className="glyphicon glyphicon-remove"></span>
        );

        break;
    }

    var button = (
      <button className={'btn btn-'+className+' btn-lg'}
              onClick={click}
              disabled={disabled}>
        {icon}
      </button>
    );

    return (
      <div id="button-frame">
        {button}
        <br/><br/>
        <button className="btn btn-warning btn-xs"
                onClick={this.props.redraw}
                disabled={this.props.redraws === 0}>
          <span className="glyphicon glyphicon-refresh">
            &nbsp;{this.props.redraws}
          </span>
        </button>
      </div>
    );
  }
});

// ANSWER
var AnswerFrame = React.createClass({
  render: function () {
    var props = this.props;
    var selectedNumbers = props.selectedNumbers.map(function (i) {
      return (
        <span onClick={props.unselectNumber.bind(null, i)}
              key={i}>{i}</span>
      );
    });

    return (
      <div id="answer-frame">
        <div className="well">
          {selectedNumbers}
        </div>
      </div>
    );
  }
});

// NUMBERS
var NumbersFrame = React.createClass({
  render: function () {
    var numbers = [];
    var className;
    var selectedNumbers = this.props.selectedNumbers;
    var selectNumber = this.props.selectNumber;
    var usedNumbers = this.props.usedNumbers;

    for (var i = 1; i <= 9; i++) {
      className = 'number selected-'+(selectedNumbers.indexOf(i) >= 0);
      className += ' used-'+(usedNumbers.indexOf(i) >= 0);

      numbers.push(
        <div className={className} 
             onClick={selectNumber.bind(null, i)}
             key={i}>{i}</div>
      );
    }

    return (
      <div id="numbers-frame">
        <div className="well">
          {numbers}
        </div>
      </div>
    );
  }
});

// DONE
var DoneFrame = React.createClass({
  render: function () {
    return (
      <div className="well text-center">
        <h2>{this.props.doneStatus}</h2>
        <button className="btn btn-default"
                onClick={this.props.resetGame}>
          Play again!
        </button>
      </div>
    );
  }
});

// GAME
var Game = React.createClass({
  getInitialState: function () {
    return {
      numberOfStars: this.randomNumber(),
      selectedNumbers: [],
      correct: null,
      usedNumbers: [],
      redraws: 5,
      doneStatus: null,
    };
  },
  resetGame: function () {
    this.replaceState(this.getInitialState());
  },
  possibleSolution: function () {
    var numberOfStars = this.state.numberOfStars;
    var possibleNumbers = [];
    var usedNumbers = this.state.usedNumbers;

    for (var i=1; i<=9; i++) {
      if (usedNumbers.indexOf(i) < 0) {
        possibleNumbers.push(i);
      }
    }

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  },
  updateDoneStatus: function () {
    if (this.state.selectedNumbers === 9) {
      this.setState({
        doneStatus: 'Done. Nice! :)',
      });

      return;
    }

    if (this.state.redraws === 0 && !this.possibleSolution()) {
      this.setState({
        doneStatus: 'Game over! :(',
      });
    }
  },
  randomNumber: function () {
    return Math.floor(Math.random() * 9) + 1;
  },
  selectNumber: function (clickedNumber) {
    if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
        correct: null,
      });
    }
  },
  unselectNumber: function (clickedNumber) {
    var selectedNumbers = this.state.selectedNumbers;
    var idx = selectedNumbers.indexOf(clickedNumber);

    selectedNumbers.splice(idx, 1);

    this.setState({
      selectedNumbers: selectedNumbers,
      correct: null,
    });
  },
  checkAnswer: function () {
    var correct = (this.state.numberOfStars === this.sumOfSelectedStars());

    this.setState({
      correct: correct,
    });
  },
  sumOfSelectedStars: function () {
    return this.state.selectedNumbers.reduce(function (a, b) {
      return a + b;
    }, 0);
  },
  acceptAnswer: function () {
    var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);

    this.setState({
      selectedNumbers: [],
      usedNumbers: usedNumbers,
      correct: null,
      numberOfStars: this.randomNumber(),
    }, function () {
      this.updateDoneStatus();
    });
  },
  redraw: function () {
    if (this.state.redraws > 0) {
      this.setState({
        numberOfStars: this.randomNumber(),
        selectedNumbers: [],
        correct: null,
        redraws: this.state.redraws - 1,
      }, function () {
        this.updateDoneStatus();
      });
    }
  },
  render: function () {
    var selectedNumbers = this.state.selectedNumbers;
    var numberOfStars = this.state.numberOfStars;
    var correct = this.state.correct;
    var usedNumbers = this.state.usedNumbers;
    var redraws = this.state.redraws;
    var doneStatus = this.state.doneStatus;
    var bottomFrame = (
      <NumbersFrame selectedNumbers={selectedNumbers}
                    selectNumber={this.selectNumber}
                    usedNumbers={usedNumbers}/>
    );
    
    if (doneStatus) {
      bottomFrame = (
        <DoneFrame doneStatus={doneStatus}
                   resetGame={this.resetGame}/>
      );
    }

    return (
      <div id="game">
        <h2>Play Nine!</h2>

        <div className="clearfix">
          <StarsFrame numberOfStars={numberOfStars}/>
          <ButtonFrame selectedNumbers={selectedNumbers}
                       correct={correct}
                       checkAnswer={this.checkAnswer}
                       acceptAnswer={this.acceptAnswer}
                       redraw={this.redraw}
                       redraws={redraws}/>
          <AnswerFrame selectedNumbers={selectedNumbers}
                       unselectNumber={this.unselectNumber}/>
          {bottomFrame}
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Game/>, 
  document.getElementById('container')
);
