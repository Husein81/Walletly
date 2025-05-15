// Global imports
import { SafeAreaView } from "react-native-safe-area-context";

// Local imports
import ExpenseForm from "~/components/Expense/ExpenseForm";
import { Icon } from "~/lib/icons/Icon";
import { useColorScheme } from "~/lib/useColorScheme";
import useModalStore from "~/store/modalStore";

const Home = () => {
  const { isDarkColorScheme } = useColorScheme();
  const { onOpen } = useModalStore();

  const handleOpenForm = () => onOpen(<ExpenseForm />, "");
  return (
    <SafeAreaView className="flex-1">
      <Icon
        name="Plus"
        size={32}
        onPress={handleOpenForm}
        className="absolute bottom-10 right-4 bg-primary rounded-full p-3"
        color={isDarkColorScheme ? "#000" : "#fff"}
      />
    </SafeAreaView>
  );
};
export default Home;
