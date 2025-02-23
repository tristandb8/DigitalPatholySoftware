import React, { Component } from "react";
// import { ReactComponent as RulerButton } from "../resources/Ruler.svg";
import { ReactComponent as GridButton } from "../resources/Grid.svg";
import { ReactComponent as ExpandButton } from "../resources/Expand.svg";
import { ReactComponent as TapButton } from "../resources/Tap.svg";
import { ReactComponent as ZoomButton } from "../resources/SearchRight.svg";
import { ReactComponent as MeasureButton } from "../resources/RulerRound.svg";
import { ReactComponent as SquareButton } from "../resources/ShadedSquare.svg";
import { ReactComponent as CircleButton } from "../resources/ShadedCircle.svg";
import { ReactComponent as CloseButton } from "../resources/Close.svg";
import { ReactComponent as PolyButton } from "../resources/Polygon.svg";
import { Modes } from "../utils/canvasModes";
import "../App.css";

import PanZoomCanvas from "./PanZoomCanvas";
const { ipcRenderer } = window.require("electron");

class ToolButton extends Component {
  render() {
    const className = this.props.selected
      ? "toolbarButtonSelected"
      : "toolbarButton";
    return (
      <div onClick={this.props.onClick} className={className}>
        {this.props.children}
      </div>
    );
  }
}

class Toolbar extends Component {
  render() {
    return (
      <div className="toolbar">
        {/* Ruler */}
        {/* <ToolButton
          onClick={() => {
            this.props.toggleRuler();
          }}
          selected={this.props.ruler}
        >
          <RulerButton className="tabbarButton" />
        </ToolButton> */}
        {/* Grid */}
        <ToolButton
          selected={this.props.grid}
          onClick={() => {
            this.props.toggleGrid();
          }}
        >
          <GridButton className="tabbarButton" />
        </ToolButton>
        {/* View reset */}
        <ToolButton onClick={this.props.resetView}>
          <ExpandButton className="tabbarButton" />
        </ToolButton>
        <div className="verticalRule" />
        {/* Pan Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.Pan);
          }}
          selected={this.props.mode === Modes.Pan}
        >
          <TapButton className="tabbarButton" />
        </ToolButton>
        {/* Zoom Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.Zoom);
          }}
          selected={this.props.mode === Modes.Zoom}
        >
          <ZoomButton className="tabbarButton" />
        </ToolButton>
        {/* Measure Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.Measure);
          }}
          selected={this.props.mode === Modes.Measure}
        >
          <MeasureButton className="tabbarButton" />
        </ToolButton>
        <div className="verticalRule" />
        {/* Annotate Square Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.AnnotateSquare);
          }}
          selected={this.props.mode === Modes.AnnotateSquare}
        >
          <SquareButton className="tabbarButton" />
        </ToolButton>
        {/* Annotate Circle Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.AnnotateCircle);
          }}
          selected={this.props.mode === Modes.AnnotateCircle}
        >
          <CircleButton className="tabbarButton" />
        </ToolButton>
        {/* Annotate Polygon Mode */}
        <ToolButton
          onClick={() => {
            this.props.switchMode(Modes.AnnotatePolygon);
          }}
          selected={this.props.mode === Modes.AnnotatePolygon}
        >
          <PolyButton className="tabbarButton" />
        </ToolButton>
      </div>
    );
  }
}

class Tab extends Component {
  render() {
    const className = this.props.selected ? "tabSelected" : "tab";
    return (
      <div
        className={className}
        onClick={() => {
          this.props.onClick();
        }}
      >
        <p
          className="tabTitle"
          style={{ color: this.props.selected ? "#333333" : "#616161" }}
        >
          {this.props.title}
        </p>
        <div className="tabClose">
          <CloseButton
            className="tabCloseIcon"
            onClick={(e) => {
              e.stopPropagation();
              this.props.closeTab();
            }}
          />
        </div>
      </div>
    );
  }
}

class Tabbar extends Component {
  render() {
    return (
      <div className="tabbar">
        {[...this.props.tabs.keys()].map((key, index) => (
          <Tab
            key={key}
            selected={key === this.props.project.activeFile}
            onClick={(e) => {
              this.props.selectTab(key);
            }}
            closeTab={() => {
              this.props.closeTab(key);
              this.props.resetView();
            }}
            title={`${this.props.project.files.get(key).name}`}
          />
        ))}
      </div>
    );
  }
}

export default class DisplayPage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      mode: Modes.Pan,
      grid: true,
      ruler: false,
    };
  }

  resetView = () => {
    if (this.canvasRef.current != null) this.canvasRef.current.resetView();
  };

  actualSize = () => {
    if (this.canvasRef.current != null) this.canvasRef.current.actualSize();
  };

  zoomIn = () => {
    if (this.canvasRef.current != null) this.canvasRef.current.zoomIn();
  };

  zoomOut = () => {
    if (this.canvasRef.current != null) this.canvasRef.current.zoomOut();
  };

  toggleGrid = () => {
    this.setState({
      grid: !this.state.grid,
    });
  };

  toggleRuler = () => {
    this.setState({
      ruler: !this.state.ruler,
    });
  };

  switchMode = (mode) => {
    this.setState({
      mode: mode,
    });
  };

  onZoom = (ref) => {
    // console.log(ref.state.scale);
  };

  componentDidMount() {
    ipcRenderer.on("reset-view", (event) => {
      this.resetView();
    });

    ipcRenderer.on("toggle-grid", (event) => {
      this.toggleGrid();
    });

    ipcRenderer.on("pan-mode", (event) => {
      this.switchMode(Modes.Pan);
    });

    ipcRenderer.on("zoom-mode", (event) => {
      this.switchMode(Modes.Zoom);
    });

    ipcRenderer.on("measure-mode", (event) => {
      this.switchMode(Modes.Measure);
    });

    ipcRenderer.on("annotate-square-mode", (event) => {
      this.switchMode(Modes.AnnotateSquare);
    });

    ipcRenderer.on("annotate-circle-mode", (event) => {
      this.switchMode(Modes.AnnotateCircle);
    });

    ipcRenderer.on("annotate-polygon-mode", (event) => {
      this.switchMode(Modes.AnnotatePolygon);
    });

    ipcRenderer.on("zoom-in", (event) => {
      this.zoomIn();
    });

    ipcRenderer.on("zoom-out", (event) => {
      this.zoomOut();
    });

    ipcRenderer.on("actual-view", (event) => {
      this.actualSize();
    });
  }

  render() {
    return (
      <div className="displayPage">
        <Tabbar
          project={this.props.project}
          closeTab={this.props.closeTab}
          selectTab={this.props.selectTab}
          resetView={this.resetView}
          tabs={this.props.tabs}
        />
        <Toolbar
          grid={this.state.grid}
          ruler={this.state.ruler}
          mode={this.state.mode}
          resetView={this.resetView}
          toggleGrid={this.toggleGrid}
          toggleRuler={this.toggleRuler}
          switchMode={this.switchMode}
        />
        <PanZoomCanvas
          ref={this.canvasRef}
          grid={this.state.grid}
          file={this.props.project.files.get(this.props.project.activeFile)}
          onZoom={this.onZoom}
          addAnnotation={this.props.addAnnotation}
          selectedAnnotation={this.props.selectedAnnotation}
          selectAnnotation={this.props.selectAnnotation}
          mode={this.state.mode}
          compositeOp={this.props.compositeOp}
        />
      </div>
    );
  }
}
