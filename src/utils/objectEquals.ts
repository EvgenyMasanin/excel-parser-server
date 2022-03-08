type ObjectEquals = <T extends object>(obj1: T, obj2: T, propsToEqual?: Array<keyof T>) => boolean

const objectEquals: ObjectEquals = (obj1, obj2, propsToBeEqual?) => {
  if (!propsToBeEqual)
    return Object.entries(obj1)
      .map(([key, value]) => value === obj2[key])
      .every(Boolean)

  return propsToBeEqual.map((prop) => obj1[prop] === obj2[prop]).every(Boolean)
}

export default objectEquals
