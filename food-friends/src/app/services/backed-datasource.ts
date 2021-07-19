import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { UserModel } from "../models/UserModel";
import { PaginatedBackendService } from "./paginated-backend.service";

export class BackendDataSource implements DataSource<UserModel> {

    private userSubject = new BehaviorSubject<UserModel[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private paginatedBackendService: PaginatedBackendService) {}

    connect(collectionViewer: CollectionViewer): Observable<UserModel[]> {
        return this.userSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    loadUsers( filter = '',
                sortDirection = 'asc', pageIndex: number, pageSize: number) {

        console.log('pageIndex: ', pageIndex, 'pageSize: ', pageSize )
        this.loadingSubject.next(true);

        this.paginatedBackendService.findUsers(filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(users => {
            console.log('::: paginated backend serivce findUsers()', users)
            this.userSubject.next(users)
        });
    }    
}