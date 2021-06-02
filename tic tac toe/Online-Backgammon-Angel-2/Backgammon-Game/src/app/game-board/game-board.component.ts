import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Checkers } from "../classes/checkers";
import { DataService } from "../data.service";
//add logic for fuck's sake**********************************
@Component({
  selector: 'app-game-board',
  template: `<button>{{value}}</button>`,
  styles: ['button { width: 100%; height: 100%; font-size: 5em !important; }']
})
export class GameBoardComponent implements OnInit {
  @Input() value : 'x' | 'o'
  
  @ViewChild('imageID')
  private imageID: ElementRef;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }
}
//add logic for fuck's sake**********************************