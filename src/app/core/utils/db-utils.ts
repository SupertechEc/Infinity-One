export function convertSnaps<T>(snaps: any): any {
    return snaps.map((a: any) => {
        const data = a.payload.doc.data() as T;
        const id = a.payload.doc.id;
        return { id, ...data };
    });
}
