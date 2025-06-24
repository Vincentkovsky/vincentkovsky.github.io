import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// 初始化 Firebase Admin
admin.initializeApp();

// 配置邮件传输器
const mailTransport = nodemailer.createTransport({
  service: "gmail", // 使用 Gmail
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.pass || process.env.EMAIL_PASS,
  },
});

// 收件人邮箱
const RECIPIENT_EMAIL = functions.config().email?.recipient || "vincent.jin@icloud.com";

/**
 * 当新的联系表单消息被添加到 Firestore 时触发
 * 发送邮件通知
 */
export const sendContactFormEmail = functions.firestore
  .document("contactMessages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.data();
    const messageId = context.params.messageId;

    functions.logger.log("New contact form submission:", messageId, messageData);

    try {
      // 创建邮件内容
      const mailOptions = {
        from: `"Personal Website" <${functions.config().email?.user || "noreply@example.com"}>`,
        to: RECIPIENT_EMAIL,
        subject: `新联系表单消息: ${messageData.name}`,
        html: `
          <h2>您收到了一条新的联系表单消息</h2>
          <p><strong>姓名:</strong> ${messageData.name}</p>
          <p><strong>邮箱:</strong> ${messageData.email}</p>
          <p><strong>消息:</strong></p>
          <p>${messageData.message.replace(/\n/g, "<br>")}</p>
          <p><strong>时间:</strong> ${messageData.createdAt.toDate().toLocaleString()}</p>
          <hr>
          <p>您可以通过回复此邮件直接联系发件人。</p>
        `,
      };

      // 发送邮件
      await mailTransport.sendMail(mailOptions);

      // 更新消息状态为已通知
      await admin.firestore().collection("contactMessages").doc(messageId).update({
        notificationSent: true,
        notificationTime: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.log(`Email notification sent for message ${messageId}`);
      return { success: true };
    } catch (error) {
      functions.logger.error("Error sending email:", error);
      return { error: "Failed to send email notification" };
    }
  });

/**
 * 定期清理旧的访问者记录 (保留最近 30 天的数据)
 * 每天凌晨 3 点运行
 */
export const cleanupOldVisitorData = functions.pubsub
  .schedule("0 3 * * *")
  .timeZone("Asia/Shanghai") // 设置为您的时区
  .onRun(async (context) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 天前

    try {
      // 查询 30 天前的访问者记录
      const oldVisitorsQuery = admin
        .firestore()
        .collection("visitors")
        .where("timestamp", "<", cutoffDate.toISOString());

      const snapshot = await oldVisitorsQuery.get();

      if (snapshot.empty) {
        functions.logger.log("No old visitor records to delete");
        return null;
      }

      // 批量删除旧记录
      const batch = admin.firestore().batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      functions.logger.log(`Deleted ${snapshot.size} old visitor records`);
      return { deleted: snapshot.size };
    } catch (error) {
      functions.logger.error("Error cleaning up old visitor data:", error);
      return { error: "Failed to clean up old visitor data" };
    }
  });

// 导出其他 Functions...
