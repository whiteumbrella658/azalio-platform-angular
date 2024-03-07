import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges,OnChanges } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface DataNode {
  name: string;
  id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  children?: DataNode[];
  parent: any;
  removed?: boolean;
}


@Component({
  selector: 'app-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.scss']
})

/**
 * @title Tree with nested nodes
 */

export class NestedTableComponent implements OnInit, OnChanges {

  @Input() type;
  @Input() mode;
  @Input() data;
  @Output() changeClick: EventEmitter<any> = new EventEmitter<any>();
  treeControl = new NestedTreeControl<DataNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DataNode>();

  constructor() {
  }
  ngOnInit(): void {
    this.dataSource.data = this.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes.data.currentValue !== undefined) {
      if (changes.data.currentValue === null || changes.data.currentValue === undefined) {
        this.dataSource.data = null;
      } else {
        this.dataSource.data = changes.data.currentValue;
        Object.keys(this.dataSource.data).forEach(x => {
          this.setParent(this.dataSource.data[x], null);
          this.dataSource.data[x].indeterminate = this.dataSource.data[x].children.some(child => child.selected);
        });
      }
    }
    if (changes['mode'] && changes.mode.currentValue !== undefined) {
      this.mode = changes.mode.currentValue;
    }
  }



  hasChild = (_: number, node: DataNode) => {
   return !!node.children && node.children.length > 0;
  }

  setParent(data, parent) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }
  todoItemSelectionToggle(checked, node) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach(x => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
  }

  removeAllParents(node) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.removed = descendants.every(child => child.removed);
      this.removeAllParents(node.parent);
    }
  }
  todoItemRemove(node) {
    node.removed = true;
    if (node.children) {
      node.children.forEach(x => {
        this.todoItemRemove(x);
      });
    }
    this.removeAllParents(node);
  }

  submit() {
    if (this.type === 'display') {
      return;
    }
    let outputArr = [];
    this.dataSource.data.forEach(node => {
      let result = [];
      result = result.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id)
          .map(x => {return {name: x.name, id: x.id}})
      );
      if (result.length > 0) {
        outputArr.push({name: node.name, id: node.id, selected: node.selected, children: result});
      } else if (node.selected) {
        outputArr.push({name: node.name, id: node.id, selected: node.selected, children: node.children});
      }
    });
      setTimeout(() => {
        this.changeClick.emit(outputArr);
      }, 1000);
}


}
