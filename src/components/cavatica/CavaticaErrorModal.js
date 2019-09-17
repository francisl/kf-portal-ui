import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// TODO JB : move to ...
import { ModalTitle } from 'components/Modal/ui';
import CloseIcon from 'react-icons/lib/md/close';
import { WhiteButton, TealActionButton } from 'uikit/Button';

import Row from 'uikit/Column';
import { closeModal } from 'store/actionCreators/ui/modalComponent';

class CavaticaErrorModal extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
  };

  handleRetry = () => {
    this.props.dispatch(this.props.global.actions.retry);
  };

  handleCancel = () => {
    this.props.dispatch(this.props.global.actions.cancel);
  };

  renderHeader() {
    return (
      <React.Fragment>
        <ModalTitle>Something went wrong...</ModalTitle>
        {/* TODO JB : export to a generic button / title ? */}
        <CloseIcon
          css="cursor:pointer; width:22px; height:22px;"
          fill="black"
          onClick={this.props.closeModal}
        />
      </React.Fragment>
    );
  }

  renderBody() {
    return (
      <React.Fragment>
        <section>
          <p>This is some explanatory text...</p>
        </section>
        <section>
          <p>This is some error details...</p>
        </section>
      </React.Fragment>
    );
  }

  renderFooter() {
    // TODO JB : disable the button while retrying
    // const { retrying } = this.state;
    const retrying = false;
    return (
      <React.Fragment>
        <WhiteButton key="abort" onClick={this.handleCancel}>
          Cancel
        </WhiteButton>
        <TealActionButton key="retry" disabled={retrying} onClick={this.handleRetry}>
          Retry
        </TealActionButton>
      </React.Fragment>
    );
  }

  render() {
    const {
      cavatica: { error },
    } = this.props;

    console.log(`RENDER`, error);
    return (
      <React.Fragment>
        <Row className="header">{this.renderHeader()}</Row>
        <Row className="body">{this.renderBody()}</Row>
        <Row className="footer">{this.renderFooter()}</Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    cavatica: state.ui.cavaticaErrorHandler,
    global: state.ui.modalComponent,
  };
};

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators({ closeModal });
  return { ...actions, dispatch };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CavaticaErrorModal);
