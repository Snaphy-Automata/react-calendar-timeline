//Created by Robins
//7th Sept 2018
import PropTypes                    from 'prop-types'
import React, { Component }         from 'react'
import Item                         from '../items/Item'
import { List }                     from 'react-virtualized'
import GroupRow                     from '../row/GroupRow'
import { _get, arraysEqual, keyBy } from '../utility/generic'

const canResizeLeft = (item, canResize) => {
  const value =
    _get(item, 'canResize') !== undefined ? _get(item, 'canResize') : canResize
  return value === 'left' || value === 'both'
}

const canResizeRight = (item, canResize) => {
  const value =
    _get(item, 'canResize') !== undefined ? _get(item, 'canResize') : canResize
  return value === 'right' || value === 'both' || value === true
}

export default class RowItems extends Component {
  static propTypes = {
    //Ref 7th Sept 2018
    setRowListRef: PropTypes.func,
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
    selected: PropTypes.array,

    dimensionItems: PropTypes.array,
    topOffset: PropTypes.number,
    groupTops: PropTypes.array,
    useResizeHandle: PropTypes.bool,
  }

  static defaultProps = {
    selected: []
  }

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.lineCount === this.props.lineCount &&
      nextProps.groupHeights === this.props.groupHeights &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.items, this.props.items) &&
      nextProps.keys === this.props.keys &&
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.selectedItem === this.props.selectedItem &&
      nextProps.selected === this.props.selected &&
      nextProps.dragSnap === this.props.dragSnap &&
      nextProps.minResizeWidth === this.props.minResizeWidth &&
      nextProps.canChangeGroup === this.props.canChangeGroup &&
      nextProps.canMove === this.props.canMove &&
      nextProps.canResize === this.props.canResize &&
      nextProps.canSelect === this.props.canSelect &&
      nextProps.dimensionItems === this.props.dimensionItems &&
      nextProps.topOffset === this.props.topOffset &&
      nextProps.minimumWidthForItemContentVisibility ===
        this.props.minimumWidthForItemContentVisibility
    )
  }

  // TODO: this is exact same function as utility
  getGroupOrders() {
    const { groupIdKey } = this.props.keys

    let groupOrders = {}

    for (let i = 0; i < this.props.groups.length; i++) {
      groupOrders[_get(this.props.groups[i], groupIdKey)] = i
    }

    return groupOrders
  }

  isSelected(item, itemIdKey) {
    if (!this.props.selected) {
      return this.props.selectedItem === _get(item, itemIdKey)
    } else {
      let target = _get(item, itemIdKey)
      return this.props.selected.includes(target)
    }
  }

  // TODO: this is exact same logic as utility function
  //FIXME: 7th Sept 2018
  //Update it to only search from those items which is present in the group..
  getVisibleItems(canvasTimeStart, canvasTimeEnd) {
    const { itemTimeStartKey, itemTimeEndKey } = this.props.keys

    return this.props.items.filter(item => {
      return (
        _get(item, itemTimeStartKey) <= canvasTimeEnd &&
        _get(item, itemTimeEndKey) >= canvasTimeStart
      )
    })
  }


  cellRenderer ({ index, key, style }) {
    //First check if the item is visible or not...
    const {
      groupHeights,
      canvasTimeStart,
      canvasTimeEnd,
      dimensionItems,
      items,
      minimumWidthForItemContentVisibility,
      //Horizontal Lines Props
      clickTolerance,
      onRowClick,
      onRowDoubleClick,
    } = this.props
    const { itemTimeStartKey, itemTimeEndKey } = this.props.keys
    const item = items[index]
    const isVisible = _get(item, itemTimeStartKey) <= canvasTimeEnd && _get(item, itemTimeEndKey) >= canvasTimeStart
    const { itemIdKey, itemGroupKey } = this.props.keys

    const groupOrders = this.getGroupOrders()

    const sortedDimensionItems = keyBy(dimensionItems, 'id')

    return (
      <div
        key={key}
        style={style}
      >
      <GroupRow
        clickTolerance={clickTolerance}
        onClick={evt => onRowClick(evt, index)}
        onDoubleClick={evt => onRowDoubleClick(evt, index)}
        key={`horizontal-line-${index}`}
        isEvenRow={index % 2 === 0}
        style={{
          width: `${this.props.canvasWidth}px`,
          height: `${groupHeights[index] - 1}px`
        }}
      />
      {isVisible &&
        <Item
          style={{}}
          key={_get(item, itemIdKey)}
          item={item}
          keys={this.props.keys}
          order={groupOrders[_get(item, itemGroupKey)]}
          dimensions={
            sortedDimensionItems[_get(item, itemIdKey)].dimensions
          }
          selected={this.isSelected(item, itemIdKey)}
          canChangeGroup={
            _get(item, 'canChangeGroup') !== undefined
              ? _get(item, 'canChangeGroup')
              : this.props.canChangeGroup
          }
          canMove={
            _get(item, 'canMove') !== undefined
              ? _get(item, 'canMove')
              : this.props.canMove
          }
          canResizeLeft={canResizeLeft(item, this.props.canResize)}
          canResizeRight={canResizeRight(item, this.props.canResize)}
          canSelect={
            _get(item, 'canSelect') !== undefined
              ? _get(item, 'canSelect')
              : this.props.canSelect
          }
          useResizeHandle={this.props.useResizeHandle}
          topOffset={this.props.topOffset}
          groupTops={this.props.groupTops}
          canvasTimeStart={this.props.canvasTimeStart}
          canvasTimeEnd={this.props.canvasTimeEnd}
          canvasWidth={this.props.canvasWidth}
          dragSnap={this.props.dragSnap}
          minResizeWidth={this.props.minResizeWidth}
          onResizing={this.props.itemResizing}
          onResized={this.props.itemResized}
          moveResizeValidator={this.props.moveResizeValidator}
          onDrag={this.props.itemDrag}
          onDrop={this.props.itemDrop}
          onItemDoubleClick={this.props.onItemDoubleClick}
          onContextMenu={this.props.onItemContextMenu}
          onSelect={this.props.itemSelect}
          itemRenderer={this.props.itemRenderer}
          minimumWidthForItemContentVisibility={
            minimumWidthForItemContentVisibility
          }
        />
      }
    </div>
    )
  }


  /**
   * Will calculate row heights..
   */
  rowHeight({index}){
    const {
      dimensionItems,
      items,
    } = this.props
    const item = items[index]
    const { itemIdKey } = this.props.keys

    const sortedDimensionItems = keyBy(dimensionItems, 'id')
    const dimensions = sortedDimensionItems[_get(item, itemIdKey)].dimensions
    return dimensions.height;
  }


  render() {
    const {
      screenHeight,
      setRowListRef,
    } = this.props

    return (
      <List
        ref={(instance) => {
          setRowListRef(instance);
        }}
        className="rct-items rct-horizontal-lines"
        width={this.props.canvasWidth}
        height={screenHeight}
        rowCount={this.props.items.length}
        rowHeight={this.rowHeight.bind(this)}
        rowRenderer={this.cellRenderer.bind(this)}
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      />
    )
  }
}
