//Created by Robins
//7th Sept 2018
import PropTypes                    from 'prop-types'
import React, { PureComponent }         from 'react'
import List                         from 'react-virtualized/dist/commonjs/List';

import { _get }                     from '../utility/generic'
import RowItem                      from './RowItem'


export default class RowItems extends PureComponent {
  static propTypes = {
    //Ref 7th Sept 2018
    lineHeight: PropTypes.number.isRequired,
    getItemHeight: PropTypes.func.isRequired,
    itemHeightRatio: PropTypes.number.isRequired,
    setRowListRef: PropTypes.func,
    stackItem: PropTypes.func.isRequired,
    getItemHoc: PropTypes.func.isRequired,
    //Row
    lineCount: PropTypes.number.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onRowDoubleClick: PropTypes.func.isRequired,
    clickTolerance: PropTypes.number.isRequired,

    //Items
    screenHeight: PropTypes.number.isRequired,
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    minimumWidthForItemContentVisibility: PropTypes.number.isRequired,
    dragSnap: PropTypes.number,
    minResizeWidth: PropTypes.number,
    selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    canChangeGroup: PropTypes.bool.isRequired,
    canMove: PropTypes.bool.isRequired,
    canResize: PropTypes.oneOf([true, false, 'left', 'right', 'both']),
    canSelect: PropTypes.bool,
    keys: PropTypes.object.isRequired,
    moveResizeValidator: PropTypes.func,
    itemSelect: PropTypes.func,
    itemDrag: PropTypes.func,
    itemDrop: PropTypes.func,
    itemResizing: PropTypes.func,
    itemResized: PropTypes.func,
    onItemDoubleClick: PropTypes.func,
    onItemContextMenu: PropTypes.func,
    itemRenderer: PropTypes.func,
    //selected: PropTypes.array,
    topOffset: PropTypes.number,
    useResizeHandle: PropTypes.bool,
  }

  static defaultProps = {
    //selected: []
  }

  constructor(props){
    super(props)
    //this.isItemSelected = this.isSelected.bind(this)
    this.renderItem     = this.cellRenderer.bind(this)
    this.ItemComponent  = props.getItemHoc(RowItem)
  }


  // isSelected(item, itemIdKey) {
  //   if (!this.props.selected) {
  //     return this.props.selectedItem === _get(item, itemIdKey)
  //   } else {
  //     let target = _get(item, itemIdKey)
  //     return this.props.selected.includes(target)
  //   }
  // }



  cellRenderer ({ index, key, style }) {
    //First check if the item is visible or not...
    const {
      items,
      keys,
      stackItem,
      onRowClick,
      onRowDoubleClick,
      clickTolerance,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minimumWidthForItemContentVisibility,
      dragSnap,
      minResizeWidth,
      canChangeGroup,
      canMove,
      canResize,
      canSelect,
      moveResizeValidator,
      itemSelect,
      itemDrag,
      itemDrop,
      itemResizing,
      itemResized,
      onItemDoubleClick,
      onItemContextMenu,
      itemRenderer,
      topOffset,
      useResizeHandle,
      //selected,
    } = this.props

    const item = items[index]
    const ItemComponent = this.ItemComponent;
    console.log("Renderer getting called")

    return (
      <ItemComponent
      stackItem={stackItem}
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
      clickTolerance={clickTolerance}
      canvasTimeStart={canvasTimeStart}
      canvasTimeEnd={canvasTimeEnd}
      canvasWidth={canvasWidth}
      minimumWidthForItemContentVisibility={minimumWidthForItemContentVisibility}
      dragSnap={dragSnap}
      minResizeWidth={minResizeWidth}
      canChangeGroup={canChangeGroup}
      canMove={canMove}
      canResize={canResize}
      canSelect={canSelect}
      moveResizeValidator={moveResizeValidator}
      itemSelect={itemSelect}
      itemDrag={itemDrag}
      itemDrop={itemDrop}
      itemResizing={itemResizing}
      itemResized={itemResized}
      onItemDoubleClick={onItemDoubleClick}
      onItemContextMenu={onItemContextMenu}
      itemRenderer={itemRenderer}
      topOffset={topOffset}
      useResizeHandle={useResizeHandle}
      //selected={selected}
      keys={keys}
      //isSelected={this.isItemSelected}
      itemId={item}
      key={key}
      style={style}
      index={index} />
    )
  }


  render() {
    const {
      screenHeight,
      setRowListRef,
      lineHeight,
      itemHeightRatio,
      getItemHeight,
    } = this.props
    const height = getItemHeight(lineHeight, itemHeightRatio)
    return (
      <List
        ref={(instance) => {
          setRowListRef?setRowListRef(instance):null;
        }}
        className="rct-items rct-horizontal-lines"
        width={this.props.canvasWidth}
        height={screenHeight}
        rowCount={this.props.items.length}
        rowHeight={height}
        rowRenderer={this.renderItem}
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      />
    )
  }
}
