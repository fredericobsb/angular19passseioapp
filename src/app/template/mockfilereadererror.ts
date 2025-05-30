export class MockFileReaderError {
  result: any = null;
  onload: ((ev: any) => any) | null = null;
  onerror: ((ev: any) => any) | null = null;

  readAsDataURL(file: File) {
  setTimeout(() => {
    this.result = 'data:image/png;base64,dummybase64';
    if (this.onload) {
      const event = { target: this } as any; // <<< aqui o cast pra any
      this.onload(event);
    }
  }, 0);
}
}