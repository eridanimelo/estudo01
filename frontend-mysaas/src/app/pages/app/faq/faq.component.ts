import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FaqDialogComponent } from './faq-dialog/faq-dialog.component';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { FAQ, FAQService } from '../../../services/faq.service';
import { MessageService } from '../../../shared/service/message.service';
import { PageableDto } from '../../../shared/lazy/pageable-dto';
import { Page } from '../../../shared/lazy/page';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],

  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatToolbarModule,
    MatSlideToggleModule],
})
export class FaqComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'question', 'actions'];
  dataSource: MatTableDataSource<FAQ> = new MatTableDataSource();
  pageSize: number = 5;
  pageIndex: number = 0;
  sortField: string = 'id';
  sortOrder: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Referência para o paginator
  @ViewChild(MatSort) sort!: MatSort;  // Referência para o sort

  constructor(private faqService: FAQService, private dialog: MatDialog, private errorHandler: MessageService) { }

  ngOnInit(): void {
    this.loadFAQs();
  }

  ngAfterViewInit(): void {

    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;  // Reseta para a primeira página ao mudar a ordenação
        this.loadFAQs();
      });
    }
  }

  loadFAQs(): void {
    const pageableDto: PageableDto<FAQ> = {
      page: this.pageIndex,
      size: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    };

    this.faqService.getAllFAQsLazy(pageableDto).subscribe((page: Page<FAQ>) => {
      this.dataSource.data = page.content || [];
      this.paginator.length = page.totalElements || 0;  // Atualiza o número total de elementos
    });
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadFAQs();
  }

  onSortChange(sort: any): void {
    this.sortField = sort.active;
    this.sortOrder = sort.direction;
    this.loadFAQs();
  }

  // Abrir diálogo para criar FAQ
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(FaqDialogComponent, {
      width: '400px',
      data: { action: 'create' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Adiciona o novo FAQ à lista existente
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }


  openEditDialog(faq: FAQ): void {
    const dialogRef = this.dialog.open(FaqDialogComponent, {
      width: '400px',
      data: { action: 'edit', faq }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Encontra o índice do FAQ na lista de dados
        const index = this.dataSource.data.findIndex((f) => f.id === result.id);
        if (index !== -1) {
          // Atualiza a FAQ diretamente
          this.dataSource.data[index] = result;

          // Força a atualização do MatTableDataSource com uma nova referência
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }


  // Excluir FAQ
  deleteFAQ(id: number): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Tem certeza de que deseja excluir este FAQ?' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.faqService.deleteFAQ(id).subscribe({
          next: () => {

            this.errorHandler.handleMessage('success', 'User deleted successfully!');
            this.loadFAQs();
          },
          error: (err) => {
            console.error(err);
            this.errorHandler.handleError(err);
          },
        });
      }
    });
  }
}