<template>
  <div class="page">
    <div class="global-tab-list">
      <div
        class="item active"
      >
        人物克隆
      </div>
    </div>
    <div
      class="main-content"
      v-loading="figureLoading"
    >
      <div class="left">
        <video
          class="video-cell"
          src="@/assets/video/guidance_figure.mp4"
          controls
        ></video>
        <div class="demand-cell">
          <p>参照视频中的规范进行视频素材拍摄，素材要求如下：</p>
          <p>1、拍摄时长5分钟以内</p>
          <p>2、神态自然，动作不易过大</p>
          <p>3、建议使用绿幕</p>
        </div>
        <div class="tip-cell">
          <img src="@/assets/images/icon/icon_safety.png" alt="">
          <p>您的资料均保存在本地设备中，请放心使用</p>
        </div>
      </div>
      <div class="right">
        <div class="form-label">人物名称</div>
        <div class="form-content">
          <el-input
            v-model="figureData.name"
            placeholder="请输入"
            show-word-limit
            maxlength="20"
          />
        </div>
        <div class="form-label">人物素材</div>
        <div class="form-content">
          <div
            v-loading="uploadLoading"
            element-loading-text="上传中..."
            class="tauri-upload-cell"
            v-if="isTauri === 'true'"
            @click="getFilePath"
          >
            <div class="el-upload__text">
              点击上传
            </div>
          </div>
          <el-upload
            v-else
            v-loading="uploadLoading"
            element-loading-text="上传中..."
            class="upload-cell"
            drag
            :show-file-list="false"
            :auto-upload="false"
            :on-change="(file) => handleUpload(file)"
            accept="video/mp4"
          >
            <div class="el-upload__text">
              点击上传 <span>/拖拽到此处</span>
            </div>
          </el-upload>
          <div class="upload-tip">请上传200m以内的MP4文件</div>
          <div class="file-name" v-if="figureData.video_path">
            <p class="ellipsis">{{ figureData.video_path }}</p>
            <svg
              class="icon"
              aria-hidden="true"
              @click="figureData.video_path = ''"
            >
              <use xlink:href="#icon-close" />
            </svg>
          </div>
        </div>
        <div class="flex1"></div>
        <div class="checkbox-cell">
          <el-checkbox v-model="figureData.agree" label=""/>
          <div class="agree">我同意<span @click="dialog = true">数字人克隆协议</span></div>
        </div>
        <div class="btn-cell">
          <div class="btn" v-if="figureData.status === 0">
            <img src="@/assets/images/icon/icon_clone_wait.png" alt="">
            <div class="text">克隆训练中</div>
          </div>
          <div
            v-else
            class="btn"
            @click="cloneFigure"
          >
            <img src="@/assets/images/icon/icon_clone_start.png" alt="">
            <div class="text">提交克隆</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialog"
      class="global-dialog"
      width="50%"
      title="数字人克隆协议"
      destroy-on-close
    >
      <div class="protocol-cell">
        <div class="sub-title">
          一、适用范围
        </div>
        <p class="text">
          1.本协议是您与[]（以下简称“我们”或“公司”）之间就您使用AI数字人系统获客“定制数字人”相关服务所订立的协议。若您使用本服务，则视为您已阅读且充分理解并接受本协议的约束。如您不同意我方不时对本协议的修改或补充内容，您应放弃注册、停止使用或主动取消本服务。
        </p>
        <p class="text">
          2.本协议由您与我们共同缔结，对您与我们均具有合同效力，均应受本协议条款的约束。本协议项下，公司可能会根据业务情况调整服务内容，您应审慎阅读、充分理解协议条款内容。
        </p>
        <div class="sub-title">
          二、个人信息保护
        </div>
        <p class="text">
          1.我们严格遵守法律法规保护您的个人信息，在合理的安全水平内使用各种安全保护措施以保障您的个人信息的安全，以防止信息的泄露、违法收集和使用。我们将会对您的个人信息、采集所得音视频数据、定制数字人模型提供必要的保护措施，包括但不限于规范化流程管理、提供安全的技术保障。
        </p>
        <p class="text">
          2.您可以访问、更正、删除您的个人信息，我们也提供注销账户和更正信息的渠道。
        </p>
        <p class="text">
          3.我们会按照适用的法律法规和任何相关的保密安全条款使用您的个人信息。我们深知个人信息对您的重要性，在为您提供优质服务的同时，我们将严格遵守法律法规要求以最小范围收集您的个人信息，并采取相应的安全保护措施，致力于保护您的个人信息安全可控，防止您提供的个人信息被不当使用或泄漏。
        </p>
        <p class="text">
          4.如果您对个人信息保护问题有任何疑问或投诉，您可以联系我方。具体的保护措施及联系方式请参阅《隐私政策》。
        </p>
        <div class="sub-title">
          三、拍摄须知
        </div>
        <p class="text">
          1.您知悉且理解，“定制数字人”服务涉及对个人信息的使用，个人信息包括肖像信息和声音信息。您须根据要求提供合法真实的授权视频和训练视频后方可使用服务。
        </p>
        <p class="text">
          2.我们仅会根据您使用AI数字人系统“定制数字人”相关服务的具体功能需要，收集必要的用户信息。未经您的授权同意，我们不会主动向任何第三方共享您的个人信息。
        </p>
        <p class="text">
          3.为完成“定制数字人“功能服务，对于您所上传的授权视频和训练视频，我们仅会在您授权的范围内以最小程度进行合理使用，不会将上述信息用于任何违法违规用途。
        </p>
        <p class="text">
          4.根据您选择的服务，您将上传训练视频用于AI数字人形象定制，系统将通过后期技术生成新的内容。您应按照服务操作指引-视频教程或图文教程进行“定制数字人”功能的使用，并保证您的操作符合要求。
        </p>
        <p class="text">
          5.您知悉且理解，定制的数字人姿态动作将与您上传的训练视频保持一致，请确保拍摄时的姿态满足您的定制需求。
        </p>
        <p class="text">
          6.您应对上传的训练素材及信息的合法性、真实性负责。您使用服务所上传或发布的信息、文字、图片等资料均由您自行提供，其真实性、准确性和合法性由您负责。我们不提供任何保证，并不承担任何法律责任。如果以上资料侵犯了第三方的知识产权或其他权利，责任由信息发布者本人承担，我们将依照现有法律的规定进行处理。
        </p>
        <div class="sub-title">
          四、账号使用
        </div>
        <p class="text">
          1.服务使用：您可通过各种已有和未来新增的支付渠道或公司指定的方式完成“定制数字人”服务的购买及使用。您可享受该服务。在您持续遵守相关服务使用规则下，即能够在服务期限内享受付费服务。如您不同意前述任一流程或内容的，您应立即停止下一步操作。一旦您完成了服务开通的所有程序，即视为您对所有流程及其内容无异议。
        </p>
        <p class="text">
          2.素材训练完成后，您可将定制数字人形象绑至AI数字人系统账号内使用。您理解并保证不会利用本服务提供的资源和信息自行或者帮助他人生成、获取、传播违反法律法规、违背公序良俗的信息。
        </p>
        <p class="text">
          3.您理解并认可，“定制数字人”服务是按照我们现有技术和条件所能达到的现状提供的。因现有技术限制，我们提供的服务可能存在瑕疵，并不能保证在任何情况下都能正常执行或达到您所期望的结果；您理解并认可，定制数字人形象合成效果在主观感觉上存在个体差异，此类情况不属于客观的重大技术缺陷；您理解并接受，我们提供的“定制数字人”服务旨在模拟真人形象和音色，但鉴于人工智能的技术现状，在口型、动作、表情以及发音上与真人难免会出现有差异的情况，我们会尽最大努力提升服务效果。
        </p>
        <p class="text">
          4.您理解并保证您的账号使用及您的账号名称等信息应当遵守宪法、法律和行政法规，坚持为人民服务、为社会主义服务的方向，坚持正确舆论导向，符合社会主义核心价值观，发挥舆论监督作用，促进形成积极健康、向上向善的网络文化，维护国家安全和社会公共利益，保护公民、法人和其他组织的合法权益。您对因使用服务所引起的一切后果承担全部责任，若发现您的以上内容中包含法律、行政法规禁止发布或者生成的信息的，我们有权并将立即停止生成或传输该信息，采取消除等处置措施，防止信息扩散，保存有关记录，并向有关主管部门报告。
        </p>
        <p class="text">
          5.如您使用定制数字人形象合成视频推销产品或／及品牌，您应保证严格遵守公序良俗、《中华人民共和国广告法》等有关法律法规政策、第三方平台规则等规定进行推销。同时您应保证合成视频中使用的素材（无论是您自行上传或还是其他方式，具体内容包括但不限于文字、图形、图片、音频、视频、肖像、话术、产品文案、背景图等）均不包含任何违反法律法规政策、公序良俗、第三方规则的内容，也不包含侵犯第三方合法权益（包括但不限于：知识产权、个人信息、肖像权等）的内容。
        </p>
        <p class="text">
          6.服务费用：“定制数字人”为软件收费，采用先收费后服务的方式，您一经使用我们服务后不可转让或退款(如因我们服务存在重大瑕疵导致您完全无法使用等违约情形、本协议另有约定、法律法规要求必须退款的或经我们判断后认为可以退款等除外）。服务的收费标准由我们根据公司的运营成本、运营策略等综合考虑后独立决定（调整包括但不限于促销、涨价等），并在相关的服务宣传及支付页面向您展示；若您在购买时，相关收费方式发生变化的，以我们实际接受的收费方式为准；相关服务的价格发生了调整的，应以我们公示的现时有效的价格为准(但我们与您另有约定的情形除外）。
        </p>
        <p class="text">
          7.服务期限：以您自行选择并支付的服务费用所对应的服务期限为准。服务期限届满后，公司将停止继续向您提供服务。 您理解并同意，如您付费期限届满且不再续费，公司有权取消您相应的付费服务，因您违反上述规则而产生的一切法律责任和损失等均由您自行承担。
        </p>
        <p class="text">
          您理解并同意，对于提供的免费或付费服务，您均会按照公司公布的各服务的使用要求及规则使用相关服务。
        </p>
        <div class="sub-title">
          五、免责声明
        </div>
        <p class="text">
          1.您确认并知悉当前服务生成的所有内容即AI生成内容都是由人工智能模型生成。我们对其生成的内容的准确性、完整性和功能性不做任何保证，并且其生成的内容不代表我们的态度或观点。您需要自行斟酌是否依赖、发布或以其他方式使用本服务提供的内容和信息，并同意自行承担相关的风险。
        </p>
        <p class="text">
          2.您确认并知悉我们不保证所提供服务内置的信息、文本、图形及其它内容资料的绝对准确性和完整性，仅供您参考，您应结合实际情况进行调整、替换。
        </p>
        <p class="text">
          3.除本规则另有规定外，我方有权根据商业判断对活动页面进行变更、中断或终止。除我方发布的其他规则或与用户签署的其他文件另有规定外，我方不对相应的变更、中断或终止承担任何责任。
        </p>
        <div class="sub-title">
          六、服务的变更
        </div>
        <p class="text">
          1.您理解并同意，公司提供的服务是按照现有技术和条件所能达到的现状提供的。公司会尽最大努力向您提供服务，确保服务的连贯性和安全性。您理解，公司不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵及其他各种安全问题的侵扰等原因可能导致的服务中断、数据丢失以及其他的损失和风险。
        </p>
        <p class="text">
          2.为给您带来更好的服务体验，我们持续努力改进我们的服务及技术。在新的服务及业务流程变更时，我们可能会更新本协议，并通过公告或系统消息或其他适当的方式提醒您更新的内容，以便您及时了解本用户服务协议的最新版本。但未经您明确同意，我们不会限制您按照本协议所享有的权利。
        </p>
        <p class="text">
          3.如您对变更事项不同意的，您应当于变更事项确定的生效之日起停止使用我方服务；如您在变更事项生效后仍继续使用我方服务，则视为您同意已生效的变更事项。
        </p>
        <div class="sub-title">
          七、知识产权
        </div>
        <p class="text">
          1.除非法律另有规定或双方另有约定的，您在使用本服务时生成内容的所有权归您所有(涉及到原本归属于第三方知识产权的内容除外)。您保证对于您的上传内容拥有相应的合法权利或已取得他人合法授权并有权用于本服务；否则，造成的一切后果及损失由您自行承担。在此过程中，您所上传的素材、信息将仅被用于本服务使用，我们不会提取识别信息，不会用于识别用途，服务完成后，系统将自动删除上述信息，不予留存。
        </p>
        <p class="text">
          2.公司在应用及相关服务中提供的内容（包括但不限于客户端、技术、程序、网页、文字、图片、图像、音频、视频、版面设计、电子文档等）的知识产权属于公司或合法第三方所有。公司提供本服务时所依托的客户端的著作权、专利权及其他知识产权均归公司所有。未经公司许可，任何人不得擅自使用（包括但不限于通过任何机器人、蜘蛛等程序或设备监视、复制、传播、展示、镜像、上载、下载本客户端及相关服务中的内容）。
        </p>
        <p class="text">
          3.您理解并同意，我们给予您一项普通的、在中国范围内的、非商用的、不可分的、不可转让的许可，以使用相关服务。未经我们的事先明确书面许可，任何第三方不得为任何非私人或商业目的获取或使用应用的任何部分或通过应用可直接或间接获得的任何内容、服务或资料。任何经授权的复制、发布、传播、转让应用上的信息内容及其任何部分的都必须包括此版权声明。任何用户违反本协议的规定，以任何方式对应用的任何部分进行发表、复制、转载、更改、引用、链接、下载或以其他方式进行使用，允许第三方进行前述使用或向任何其他第三方提供获取应用任何内容的渠道，则我们有权立即冻结/注销其账号、停止向其提供任何服务、要求该用户及第三方停止使用前述内容并要求该用户赔偿一切损失。该用户必须按照我们的要求，归还或销毁（或促使第三方归还或销毁）使用服务任何部分的内容所创建的资料的任何副本。
        </p>
        <div class="sub-title">
          八、法律适用、管辖与其他
        </div>
        <p class="text">
          1.本协议之订立、生效、解释、修订、补充、终止、执行与争议解决均适用中华人民共和国法律；如法律无相关规定的，参照商业惯例及/或行业惯例。
        </p>
        <p class="text">
          2.您因使用我方服务所产生及与我方服务有关的争议，由我方与您协商解决。协商不成时，任何一方均可向被告所在地人民法院提起诉讼。
        </p>
        <p class="text">
          3.本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。
        </p>
      </div>
      <div class="btn-cell">
        <div class="cancel-btn" @click="dialog = false">取消</div>
        <div class="confirm-btn" @click="agreeFn">同意</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { open } from '@tauri-apps/plugin-dialog';
import { ElMessage } from 'element-plus'
import http from '@/utils/http'
import unit from '@/utils/unit'
const isTauri = import.meta.env.VITE_APP_IS_TAURI
const router = useRouter()
const dialog = ref(false)
const figureLoading = ref(false)
const uploadLoading = ref(false)
const figureData = ref({
  name: '',
  video_path: '',
  agree: false,
  status: -1  // -1:未提交  0:AI克隆训练中 1：克隆完成 2：克隆失败
})
const props = defineProps({
  type: {
    type: String,
    required: true
  }
})
const handleUpload = (file) => {
  if (!file) return false
  uploadLoading.value = true
  unit.uploadFile({
        code: 1,
        fileName: file.name,
        file: file.raw,
        fileType: 'video'
      }).then((res) => {
        figureData.value.video_path = res
      }).finally(() => {
        uploadLoading.value = false
      })
}
const getFilePath = async () => {
  const file = await open({
      multiple: false,
      directory: false,
      filters: [{
        name: 'video',
        extensions: ['mp4']
      }]
    })
    if (file) {
      uploadLoading.value = true
      unit.uploadFile({
        code: 1,
        fileName: file,
        fileType: 'video'
      }).then((res) => {
        figureData.value.video_path = res
      }).finally(() => {
        uploadLoading.value = false
      })
    }
}
const cloneFigure = () => {
  if (!figureData.value.name) {
    ElMessage({
      message: '请填写人物名称',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if (!figureData.value.video_path) {
    ElMessage({
      message: '请上传MP4文件',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if (!figureData.value.agree) {
    ElMessage({
      message: '请同意形象克隆协议',
      type: 'warning',
      duration: 1.5 * 1000
    })
    return false
  }
  if (figureLoading.value) {
    return false
  }
  figureLoading.value = true
  figureData.value.status = 0
  http({
    url: http.adornUrl('/digital-human-avatars/'),
    method: 'post',
    data: http.adornData({
      name: figureData.value.name,
      clone_type: figureData.value.clone_type,
      video_path: figureData.value.video_path
    })
  }).then((res) => {
    ElMessage({
      message: res.message,
      type: 'success',
      duration: 3 * 1000
    })
    router.push({
      path: '/characterList'
    })
  }).finally(() => {
    figureLoading.value = false
    figureData.value.status = -1
  })
}
const agreeFn = () => {
  figureData.value.agree = true
  dialog.value = false
}
</script>

<style lang="scss" scoped>
  @use 'index';
</style>
