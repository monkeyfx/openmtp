import React, { Component } from 'react';
import { remote } from 'electron';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { EOL } from 'os';
import { log } from '@Log';
import { styles } from './styles';
import { imgsrc } from '../../utils/imgsrc';
import GenerateErrorReport from './components/GenerateErrorReport';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    });
    const _errorInfo = JSON.stringify(errorInfo);
    log.doLog(
      `Error boundary log capture:${EOL}${error.toString()}${EOL}${_errorInfo}`,
      true,
      error
    );
  }

  _handleReload = () => {
    try {
      remote.getCurrentWindow().reload();
    } catch (e) {
      log.error(e, `ErrorBoundary -> _handleReload`);
    }
  };

  render() {
    const { classes: styles, children } = this.props;
    const { errorInfo } = this.state;
    if (errorInfo) {
      return (
        <div className={styles.root}>
          <img
            alt="Some Error Occured!"
            src={imgsrc('bug.svg', false)}
            className={styles.bugImg}
          />
          <Typography variant="h4" className={styles.headings}>
            Whoops!
          </Typography>
          <Typography variant="h5" className={styles.headings}>
            I promise it&apos;s not you, it&apos;s me.
          </Typography>
          <GenerateErrorReport />
          <Button
            variant="outlined"
            className={styles.goBackBtn}
            onClick={this._handleReload}
          >
            Reload The App
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default withStyles(styles)(ErrorBoundary);
