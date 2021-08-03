import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { UserModel } from "../models/UserModel";
import { PaginatedBackendService } from "./paginated-backend.service";

export class BackendDataSource implements DataSource<UserModel> {

    private userSubject = new BehaviorSubject<UserModel[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalEntriesSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private paginatedBackendService: PaginatedBackendService) {}

    connect(collectionViewer: CollectionViewer): Observable<UserModel[]> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
        this.totalEntriesSubject.complete();
    }

    public get totalEntriesValue(): number {
        return this.totalEntriesSubject.value;
    }

    loadUsers( filter= '',
                sortDirection= 'asc', pageIndex: number, pageSize: number) {

        // console.log('pageIndex: ', pageIndex, 'pageSize: ', pageSize )
        this.loadingSubject.next(true);

        this.paginatedBackendService.findUsers(filter, sortDirection,
            pageIndex, pageSize).pipe(
            map(resp => {
                this.totalEntriesSubject.next(resp.totalItems)
                this.userSubject.next(resp.foodFriends)
            }),
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
            
        )
        .subscribe();
    }    
}