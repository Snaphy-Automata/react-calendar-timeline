import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'

import { List} from 'react-virtualized';

export default class Sidebar extends Component {
  static propTypes = {
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
    //Update 6th sept 2018
    //Added by Robins.
    setListReference: PropTypes.func,
    screenHeight: PropTypes.number.isRequired,
  }


  constructor(props){
    super(props)
    const { groupHeights } = props
    const rowHeight   = this.rowHeight;
    const rowRenderer = this.rowRenderer;
    const renderGroupContent = this.renderGroupContent;
    this.getRowHeight = (options)=>{
      return rowHeight(options, groupHeights);
    }

    this.getRow = (options)=>{
      return rowRenderer(options, props, renderGroupContent)
    }
  }

  shouldComponentUpdate(nextProps) {
    return !(
      arraysEqual(nextProps.groups, this.props.groups) &&
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.groupHeights === this.props.groupHeights &&
      nextProps.height === this.props.height
    )
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey, props) {
    if (props.groupRenderer) {
      return React.createElement(props.groupRenderer, {
        group,
        isRightSidebar
      })
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
    }
  }

  /**
   * Will calculate row heights..
   */
  rowHeight({index}, groupHeights){
    return groupHeights[index] - 1;
  }

  rowRenderer({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }, props, renderGroupContent) {
    const { isRightSidebar, groupHeights, setListReference } = props
    const { groupIdKey, groupTitleKey, groupRightTitleKey } = props.keys
    const group = props.groups[index]
    const elementStyle = {
      height: `${groupHeights[index] - 1}px`,
      lineHeight: `${groupHeights[index] - 1}px`,
      ...style,
    }

    return (
      <div
          key={key}
          className={
            'rct-sidebar-row' +
            (index % 2 === 0 ? ' rct-sidebar-row-even' : ' rct-sidebar-row-odd')
          }
          style={elementStyle}
        >
          {renderGroupContent(
            group,
            isRightSidebar,
            groupTitleKey,
            groupRightTitleKey,
            props,
          )}
        </div>
    )
  }

  render() {
    const { width, isRightSidebar, screenHeight, setListReference } = this.props

    const sidebarStyle = {
      width: `${width}px`,
      height: `${screenHeight}px`
    }

    const groupsStyle = {
      width: `${width}px`
    }

    return (
      <div
        className={'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : '')}
        style={sidebarStyle}
      >
        <div style={groupsStyle}>
          <List
            ref={(instance) => {
              setListReference(instance);
            }}
            width={width}
            height={screenHeight}
            rowCount={this.props.groups.length}
            rowHeight={this.getRowHeight}
            rowRenderer={this.getRow}
          />
      </div>
    </div>
    )
  }
}
