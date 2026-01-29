function withMessage(validator: (c:any)=>any, message: string) {
  return (control: any) => {
    const res = validator(control);
    if (!res) return null;
    const key = Object.keys(res)[0];
    const payload = (res[key] && typeof res[key] === 'object') ? { ...res[key] } : {};
    payload.message = message;
    return { [key]: payload };
  };
}