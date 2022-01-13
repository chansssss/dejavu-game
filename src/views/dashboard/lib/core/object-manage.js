class ObjectManage {
  constructor(edit) {
    this.edit = edit
    this.initDom()
    this.initEvent()
  }
  initDom() {
    this.dom = document.createElement('div')
    this.dom.innerHTML = `
        <input type='file'/>
        <div class='object-list'></div>
    `
    this.fileDom = this.dom.querySelector('input')
  }
  initEvent() {
    this.fileDom.addEventListener('change', async e => {
      console.log(this.fileDom.files[0])
      const img = await this.getImage(await this.file2Base(this.fileDom.files[0]))
      window.image = img
      // this.edit.setCurrentObj(img)
    })
  }
  getImage(src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        resolve(img)
      }
    })
  }
  // 读文件转成base64
  file2Base(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = function(e) {
        resolve(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
}

export default ObjectManage
