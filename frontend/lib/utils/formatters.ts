export const capitalize = (text: string): string => {
    return text
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const formatPercentage = (value: number): string => {
    return `${value.toFixed(0)}%`;
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("uk-UA").format(value);
};
