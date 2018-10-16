import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PreventClickOnDrag from '../interaction/PreventClickOnDrag'

class GroupRow extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    isEvenRow: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    clickTolerance: PropTypes.number.isRequired
  }

  constructor(props){
    super(props)
  }

  render() {
    const {
      onDoubleClick,
      isEvenRow,
      style,
      onClick,
      clickTolerance
    } = this.props

    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div
          onDoubleClick={onDoubleClick}
          className={isEvenRow ? 'rct-hl-even' : 'rct-hl-odd'}
          style={style}
        />
      </PreventClickOnDrag>
    )
  }
}

export default GroupRow
