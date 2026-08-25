import DeleteButton from "../../../../components/UI/DeleteButton"

// زر حذف التصنيف مع تأكيد العملية والتعامل مع طلب الحذف.
export default function Deletepackage({ packageId , onDeleted }) {
    // console.log("Id", id)
    return (
        <DeleteButton
            endpoint={`/packages/${packageId}`}
            itemId={packageId}
            onDeleted={onDeleted}
            confirmationMessage="هل أنت متأكد من حذف  الباقة"
            successMessage="تم حذف الباقة بنجاح"
            errorMessage="حدث خطأ أثناء حذف  الباقة"
        />
    );
}