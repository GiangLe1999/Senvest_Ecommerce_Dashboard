// Next Imports
import { useParams } from "next/navigation";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// Type Imports
import type { getDictionary } from "@/utils/getDictionary";
import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from "@menu/vertical-menu";

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({
  open,
  transitionDuration,
}: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <i className="ri-arrow-right-s-line" />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const params = useParams();
  const { isBreakpointReached } = useVerticalNav();

  // Vars
  const { transitionDuration } = verticalNavOptions;
  const { lang: locale } = params;

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => (
          <RenderExpandIcon
            open={open}
            transitionDuration={transitionDuration}
          />
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-fill" /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label={dictionary["navigation"].appsPages}>
          <MenuItem
            href={`/${locale}/dashboard`}
            icon={<i className="ri-dashboard-line" />}
            exactMatch={false}
            activeUrl="/dashboard"
          >
            {dictionary["navigation"].dashboard}
          </MenuItem>

          <SubMenu
            label={dictionary["navigation"].products}
            icon={<i className="ri-shopping-bag-3-line" />}
          >
            <MenuItem href={`/${locale}/products/list`}>
              {dictionary["navigation"].list}
            </MenuItem>
            <MenuItem href={`/${locale}/products/add`}>
              {dictionary["navigation"].add}
            </MenuItem>
            <MenuItem href={`/${locale}/products/category`}>
              {dictionary["navigation"].category}
            </MenuItem>
          </SubMenu>

          <SubMenu
            label={dictionary["navigation"].orders}
            icon={<i className="ri-secure-payment-fill" />}
          >
            <MenuItem href={`/${locale}/orders/list`}>
              {dictionary["navigation"].list}
            </MenuItem>
            <MenuItem
              href={`/${locale}/orders/details/5434`}
              exactMatch={false}
              activeUrl="/orders/details"
            >
              {dictionary["navigation"].details}
            </MenuItem>
          </SubMenu>

          <SubMenu
            label={dictionary["navigation"].customers}
            icon={<i className="ri-account-pin-circle-line" />}
          >
            <MenuItem href={`/${locale}/customers/list`}>
              {dictionary["navigation"].list}
            </MenuItem>
            <MenuItem
              href={`/${locale}/customers/details/879861`}
              exactMatch={false}
              activeUrl="/customers/details"
            >
              {dictionary["navigation"].details}
            </MenuItem>
          </SubMenu>

          <MenuItem
            href={`/${locale}/manage-reviews`}
            icon={<i className="ri-file-word-line" />}
            exactMatch={false}
            activeUrl="/manage-reviews"
          >
            {dictionary["navigation"].manageReviews}
          </MenuItem>

          <MenuItem
            href={`/${locale}/referrals`}
            icon={<i className="ri-external-link-line" />}
            exactMatch={false}
            activeUrl="/referrals"
          >
            {dictionary["navigation"].referrals}
          </MenuItem>

          <MenuItem
            href={`/${locale}/settings`}
            icon={<i className="ri-settings-3-line" />}
            exactMatch={false}
            activeUrl="/settings"
          >
            {dictionary["navigation"].settings}
          </MenuItem>
        </MenuSection>
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
      </Menu> */}
    </ScrollWrapper>
  );
};

export default VerticalMenu;
