/**
 * Created by Robins
 * 10th Sept 2018.
 */
import PropTypes from 'prop-types'
import React, { Component } from 'react'

//Custom Import..
import { _get }             from '../utility/generic'

/**
 * Will render group content
 * @param {*} group
 * @param {*} isRightSidebar
 * @param {*} groupTitleKey
 * @param {*} groupRightTitleKey
 * @param {*} props
 */
const renderGroupContent = (group, isRightSidebar, groupTitleKey, groupRightTitleKey, props) => {
  if (props.groupRenderer) {
    return React.createElement(props.groupRenderer, {
      group,
      isRightSidebar,
      isItemSelected: props.isItemSelected,
    })
  } else {
    return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey)
  }
}


/**
 * Sidebar component..
 * @param {*} props
 */
const SidebarItem = (props)=>{
  const {
    isRightSidebar,
    getItemHeight,
    lineHeight,
    itemHeightRatio,
    style,
    index,
    key,
    item,
  } = props

  const { groupTitleKey, groupRightTitleKey } = props.keys
  const groupHeight = getItemHeight(lineHeight, itemHeightRatio)
  let elementStyle = {
    ...style,
    height: `${groupHeight - 1}px`,
    lineHeight: `${groupHeight - 1}px`,
    width: "93%"
  }

  let className = 'rct-sidebar-row' + (index % 2 === 0 ? ' rct-sidebar-row-even' : ' rct-sidebar-row-odd')
  if(props.isItemSelected){
    className = `${className} selected`
  }

  //Check group type..
  if(props.item && props.item.type === "section"){
    className = `${className} section`
    /*
          height: 23px;
          left: 0px;
          position: absolute;
          top: 5100px;
          width: 92%;
          line-height: 24px;
          border: 1px solid;
          border-color: red !important;
    */
  //  elementStyle = {
  //   ...elementStyle,
  //   height: `23px`,
  //   lineHeight: `23px`,
  //   width: "92%"
  // }

  }

  return (
      <div
        key={key}
        className={className}
        style={elementStyle}>
        {renderGroupContent(
          item,
          isRightSidebar,
          groupTitleKey,
          groupRightTitleKey,
          props,
        )}
      </div>
  )

}


SidebarItem.propTypes = {

}

export default SidebarItem
