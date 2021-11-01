export class MethodsUtil {

    static toEntries<T>(a: T[]) {
        return a.map((value, index) => [index, value] as const);
    }

}