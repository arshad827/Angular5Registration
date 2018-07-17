import { Component, OnInit, EventEmitter, Output, Input, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Chart } from 'chart.js';
import 'chart.piecelabel.js';
import { BtAuthService } from '..//.//..//bt-auth.service';
import { pieceLabel } from 'Chart.PieceLabel.js';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { transition, trigger, state, style, animate } from '@angular/animations';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger('divState', [
      state('in', style({ 'opacity': '0', 'transform': 'translateX(0px)' })),
      transition('void => *', [style({ 'opacity': '1', 'transform': 'translateX(300px)' }), animate(300)])
    ]),
    trigger('divStateLine', [
      state('in', style({ 'opacity': '0', 'transform': 'translateY(0px)' })),
      transition('void => *', [style({ 'opacity': '1', 'transform': 'translateY(300px)' }), animate(300)])
    ]),
  ]
})
export class ContentComponent implements OnInit {
  in;
  chart: any;
  state = 'normal';
  @Input() passedValue: Boolean;
  totalUserCount;
  totalUserdata = [];
  displayedColumns = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private btservice: BtAuthService) {

    this.btservice.allUsersData().subscribe(
      (response) => {
        console.log(this.btservice.sendResInArr);
        this.totalUserdata = this.btservice.sendResInArr;

        this.chart = new Chart('canvas', {
          type: 'doughnut',
          data: {
            labels: [
              'Android',
              'iOS',
            ],
            datasets: [{
              data: this.totalUserdata,
              backgroundColor: [
                '#FCA001', '#C2390D'
              ],
              borderColor: [
                '#FCA001', '#C2390D'
              ],
              borderWidth: 0
            }],
          },
          options: {
            responsive: true,
            display: true,
            pieceLabel: {
              mode: 'value',
              fontSize: 16,
              fontStyle: 'bold',
              fontColor: '#000',
            }
          }
        });
      }
    );
    // Create 100 users
    const users: UserData[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }
  selected = 'isvalue-0';
  userMetaCombinations: string;

  userCombinations = [
    'All',
    'Male',
    'Female'
  ];

  userCountCombination = [
    { value: 'isvalue-0', viewValue: 'All Users' },
    { value: 'isvalue-1', viewValue: 'Completed Users' },
    { value: 'isvalue-2', viewValue: 'InComplete Users' },
    { value: 'isvalue-3', viewValue: 'Deleted Users' }
  ];
  userCountMonthCombination = [
    { value: 'Jan', viewValue: 'jan 2018' },
    { value: 'Feb', viewValue: 'Feb 2018' },
    { value: 'March', viewValue: 'March 2018' },
    { value: 'April', viewValue: 'April 2018' }
  ];
  myLineChart;
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.myLineChart = new Chart('userlinechart', {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        datasets: [{
          data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478, 133, 221, 783, 2478,
            2479, 133, 221, 783, 2478, 2479, 133, 221, 783, 2478, 2479, 133, 2479, 133, 2479, 2479],
          label: 'Android',
          borderColor: '#3e95cd',
          fill: false
        }, {
          data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
          label: 'iOS',
          borderColor: '#8e5ea2',
          fill: false
        }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Complete User Count (in thousand)'
        }
      }
    });
  }

  onUserChange() {
    this.totalUserdata.length = 0;
    console.log(this.selected);
    if (this.selected === 'isvalue-0') {
      this.btservice.allUsersData().subscribe(
        (response) => {
          this.chart.destroy();
          console.log(this.btservice.sendResInArr);
          console.log(this.totalUserdata.length);
          this.totalUserdata = this.btservice.sendResInArr;
          console.log(this.totalUserdata.length);
          this.predefinedpie();
        });
    } else if (this.selected === 'isvalue-1') {
      this.btservice.allCompletedUsersData().subscribe(
        (response) => {
          console.log(this.btservice.sendResInArr);
          this.totalUserdata = this.btservice.sendResInArr;
          this.predefinedpie();
        });
    } else if (this.selected === 'isvalue-2') {
      this.btservice.getPartialRegistedUserCount().subscribe(
        (response) => {
          console.log(this.btservice.sendResInArr);
          this.totalUserdata = this.btservice.sendResInArr;
          this.predefinedpie();
        });
    } else if (this.selected === 'isvalue-3') {
      this.btservice.getDeletedUserCount().subscribe(
        (response) => {
          console.log(this.btservice.sendResInArr);
          this.totalUserdata = this.btservice.sendResInArr;
          this.predefinedpie();
        });
    }
  }

  onRefresh() {
    this.totalUserdata.length = 0;
    this.btservice.allUsersData().subscribe(
      (response) => {
        this.chart.destroy();
        console.log(this.btservice.sendResInArr);
        console.log(this.totalUserdata.length);
        this.totalUserdata = this.btservice.sendResInArr;
        console.log(this.totalUserdata.length);
        this.predefinedpie();
      });
  }













  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  predefinedpie() {
    this.chart.destroy();
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: [
          'Android',
          'iOS',
        ],
        datasets: [{
          data: this.totalUserdata,
          backgroundColor: [
            '#FCA001', '#C2390D'
          ],
          borderColor: [
            '#FCA001', '#C2390D'
          ],
          borderWidth: 0
        }],
      },
      options: {
        responsive: true,
        display: true,
        pieceLabel: {
          mode: 'value',
          fontSize: 16,
          fontStyle: 'bold',
          fontColor: '#000',
        }
      }
    });
  }
}
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

