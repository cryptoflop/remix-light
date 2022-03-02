
export function useTransform<T extends Array<unknown>, G>(input: T, transform: (data: T[0]) => G) {
  const transformedInput = input;
  transformedInput[0] = transform(transformedInput[0]);
  return transformedInput as unknown as [G, T[1]];
}