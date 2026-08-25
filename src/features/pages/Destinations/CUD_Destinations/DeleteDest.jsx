import DeleteButton from "../../../../components/UI/DeleteButton"

// زر حذف التصنيف مع تأكيد العملية والتعامل مع طلب الحذف.
export default function DeleteHotel({ id , onDeleted }) {
    return (
        <DeleteButton
            endpoint={`/destinations/${id}`}
            itemId={id}
            onDeleted={onDeleted}
            confirmationMessage="هل أنت متأكد من حذف الوجهة"
            successMessage="تم حذف الوجهة بنجاح"
            errorMessage="حدث خطأ أثناء حذف الو"
        />
    );
}