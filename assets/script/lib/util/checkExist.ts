export function checkExist<T>(
  data: T | undefined | null,
  errMessage: string = "Error on checkExist. data is undefined"
): T {
  if (!data) {
    throw new Error(errMessage);
  }
  return data;
}
