// 基底リポジトリインターフェース (LSP準拠)
export interface IBaseRepository<T, ID = string> {
  findById(_id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(_entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T | null>;
  update(_id: ID, _updates: Partial<T>): Promise<T | null>;
  delete(_id: ID): Promise<boolean>;
}

// 検索可能リポジトリインターフェース (ISP準拠)
export interface ISearchableRepository<T> {
  search(_criteria: Record<string, unknown>): Promise<T[]>;
  findByCriteria(_criteria: Record<string, unknown>): Promise<T | null>;
}

// ページネーション対応リポジトリインターフェース (ISP準拠)
export interface IPaginatedRepository<T> {
  findWithPagination(
    _page: number,
    _limit: number,
    _filters?: Record<string, unknown>
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

// トランザクション対応リポジトリインターフェース (ISP準拠)
export interface ITransactionalRepository {
  withTransaction<R>(_callback: () => Promise<R>): Promise<R>;
}
