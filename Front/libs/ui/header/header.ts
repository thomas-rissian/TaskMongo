import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatNavList } from "@angular/material/list";

@Component({
  selector: 'app-header',
  imports: [MatNavList,CommonModule],
  styleUrl: './header.css',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header{
  @Input()
  headerList: string[] = [ 'Home', 'Tasks' ];
  
 }
