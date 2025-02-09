import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TableHeader, TableMeta } from './table.model';

@Component({
  selector: 'paper-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: false
})

export class TableComponent {
  @Input() headers: TableHeader[] = [];
  @Input() data: any[] | null = [];
  @Input() isLoading: boolean | null = false;

  @Input() columnTemplates: { [key: string]: TemplateRef<any> } = {};
  @Input() metas: TableMeta = { page: 1, perPage: 10 };

  @Output() updatePagination = new EventEmitter<TableMeta>();

  get startItem(): number {
    const { page, perPage } = this.metas;
    return ((page - 1) * (this.data?.length ?? 0)) + 1;
  }

  get endItem(): number {
    return this.metas.page * (this.data?.length ?? 0);
  }

  prevPage(): void {
    if (this.metas.page > 1) {
      this.metas.page -= 1;
      this.updatePagination.emit(this.metas);
    }
  }

  nextPage(): void {
    this.metas.page += 1;

    this.updatePagination.emit(this.metas);
  }

  onPageChange(value: string): void {
    const page = parseInt(value, 10);
    if (page > 0) this.metas.page = page;

    this.updatePagination.emit(this.metas);
  }
}