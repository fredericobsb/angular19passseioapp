class MockFileReader {
  result: string | null = null;
  onload: ((ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = 'data:image/png;base64,dummybase64';
      if (this.onload) {
        this.onload(null as any);
      }
    }, 0);
  }
}