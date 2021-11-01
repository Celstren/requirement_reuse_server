export class ArrayValidator {

    static isNotEmpty(values: any[]): boolean {
        return (values?.length ?? 0) > 0;
    }

}