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
  const elementStyle = {
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
