//Created by Robins
//7th Sept 2018
import PropTypes                    from 'prop-types'
import React, { Component }         from 'react'
import { List }                     from 'react-virtualized'

import { _get }                     from '../utility/generic'
import RowItem                      from './RowItem'


export default class RowItems extends Component {
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
    selected: PropTypes.array,
    topOffset: PropTypes.number,
    useResizeHandle: PropTypes.bool,
  }

  static defaultProps = {
    selected: []
  }




  cellRenderer ({ index, key, style }) {
    //First check if the item is visible or not...
    const {
      items,
    } = this.props

    const item = items[index]

    const ItemComponent = this.props.getItemHoc(RowItem)

    return (
      <ItemComponent {...this.props} itemId={item.id} key={key} style={style} index={index} />
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
          setRowListRef(instance);
        }}
        className="rct-items rct-horizontal-lines"
        width={this.props.canvasWidth}
        height={screenHeight}
        rowCount={this.props.items.length}
        rowHeight={height}
        rowRenderer={this.cellRenderer.bind(this)}
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      />
    )
  }
}
