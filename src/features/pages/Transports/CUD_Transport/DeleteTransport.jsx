import DeleteButton from "../../../../components/UI/DeleteButton"

// زر حذف التصنيف مع تأكيد العملية والتعامل مع طلب الحذف.
export default function DeleteTransport({ id , onDeleted }) {
    return (
        <DeleteButton
            endpoint={`/transports/${id}`}
            itemId={id}
            onDeleted={onDeleted}
            confirmationMessage="هل أنت متأكد من حذف وسيلة النقل "
            successMessage="تم حذف وسيلة النقل بنجاح"
            errorMessage="حدث خطأ أثناء حذف وسيلة النقل"
        />
    );
}