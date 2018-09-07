import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'
import { List} from 'react-virtualized';

export default class Sidebar extends Component {
  static propTypes = {
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    //height: PropTypes.number.isRequired,
    //groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
    //Update 6th sept 2018
    //Added by Robins.
    setListReference: PropTypes.func,
    stackItem: PropTypes.func.isRequired,
    screenHeight: PropTypes.number.isRequired,
  }


  constructor(props){
    super(props)
    const rowHeight   = this.rowHeight.bind(this);
    const rowRenderer = this.rowRenderer;
    const renderGroupContent = this.renderGroupContent;
    this.getRowHeight = (options)=>{
      return rowHeight(options, props);
    }

    this.getRow = (options)=>{
      return rowRenderer(options, props, renderGroupContent)
    }
  }

  shouldComponentUpdate(nextProps) {
    return !(
      arraysEqual(nextProps.groups, this.props.groups) &&
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width
      //Removed by Robins 7th Sept 2018
      //nextProps.groupHeights === this.props.groupHeights
      //nextProps.height === this.props.height
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


  getGroupHeight(index, props){
    const {stackItem} = props
    const {groupHeight}    = stackItem(index)
    return groupHeight;
  }


  /**
   * Will calculate row heights..
   */
  rowHeight({index}, props){
    return this.getGroupHeight(index, props)
  }

  rowRenderer({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }, props, renderGroupContent) {
    const { isRightSidebar } = props

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = props.keys
    const group = props.groups[index]
    const groupHeight = this.getGroupHeight(index, props)
    const elementStyle = {
      ...style,
      height: `${groupHeight - 1}px`,
      lineHeight: `${groupHeight - 1}px`,
      width: "93%"
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
      //height: `${screenHeight}px`
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
            style={{
              height: "100%",
              overflow: "hidden"
            }}
          />
      </div>
    </div>
    )
  }
}
