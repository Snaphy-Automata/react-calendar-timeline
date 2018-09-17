import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { _get, arraysEqual } from '../utility/generic'
import { List} from 'react-virtualized';
import SidebarItem from './SidebarItem'

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
    getItemHeight: PropTypes.func.isRequired,
    lineHeight: PropTypes.number.isRequired,
    itemHeightRatio: PropTypes.number.isRequired,
    screenHeight: PropTypes.number.isRequired,
    getItemHoc: PropTypes.func.isRequired,
  }


  constructor(props){
    super(props)
    this.getRow = (options)=>{
      return this.rowRenderer(options, this.props)
    }
    this.getRowItem = this.getRow.bind(this);
  }

  // shouldComponentUpdate(nextProps) {
  //   return !(
  //     arraysEqual(nextProps.groups, this.props.groups) &&
  //     nextProps.keys === this.props.keys &&
  //     nextProps.width === this.props.width
  //     //Removed by Robins 7th Sept 2018
  //     //nextProps.groupHeights === this.props.groupHeights
  //     //nextProps.height === this.props.height
  //   )
  // }


  rowRenderer({
    key,         // Unique key within array of rows
    index,       // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    style        // Style object to be applied to row (to position it)
  }, props) {
    const GroupItemComponent = props.getItemHoc(SidebarItem)
    const group = props.groups[index]

    return (
      <GroupItemComponent style={style} {...props} key={key} index={index} itemId={group} />
    )
  }


  render() {
    const { width, isRightSidebar, screenHeight, setListReference } = this.props

    const sidebarStyle = {
      width: `${width}px`,
      //height: `${screenHeight}px`
    }

    const groupsStyle  = {
      width: `${width}px`
    }

    const { getItemHeight, lineHeight, itemHeightRatio } = this.props
    const height = getItemHeight(lineHeight, itemHeightRatio)

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
            rowHeight={height}
            rowRenderer={this.getRowItem}
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
